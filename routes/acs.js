const express = require("express");
const router = express.Router();
const AC = require("../models/ac");
const Level5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.id != null && req.query.id !== "") {
        searchOptions.jvNum = req.query.id;
    }
    try {
        const ac = {};
        if (searchOptions.jvNum > 0) acs = await AC.find(searchOptions);
        else acs = new AC([{ jvNum: 0, acNum: 0, acDate: Date.now(), transactions: [] }]);

        const level5s = await Level5.find().select({
            level5_code: 1,
            level5_title: 1,
            _id: 0,
        });


        const cashAcs = await Level5.find({ level4_code: 24502 }).select({
            level5_code: 1,
            level5_title: 1,
            _id: 0,
        });

        res.render("acs/acv", {
            acs: acs,
            level5: level5s,
            cashAcs: cashAcs,
            searchOptions: req.query,
        });
    } catch (err) {
        //console.log(err.message);
        res.redirect("/");
    }
});

// Create Author Route
router.post("/", async (req, res) => {

    try {
        if (req.body.jvNum > 0) {
            const ac = await AC.findOne({ jvNum: req.body.jvNum }).exec();
            //console.log(ac)
            ac.jvNum = req.body.jvNum;
            ac.jvDate = req.body.jvDate;
            ac.transactions = req.body.transactions;

            const freshAc = await ac.save();
            console.log(freshAc);
            res.json({ "ID": freshAc.jvNum, "MSG": "Saved Successfully" })

        }
        else {
            const newJvNum = await shared.getNewJvNum();

            console.log(newJvNum);

            const ac = new AC({
                jvNum: newJvNum,
                jvDate: req.body.jvDate,
                transactions: req.body.transactions,
            });

            const freshAc = await ac.save();
            res.json({ "ID": freshAc.jvNum, "MSG": "Updated Successfully" })
        }

    } catch (err) {
        console.log(err);
        res.json({ "ID": 0, "MSG": err.message })
    }
});




router.get("/:id", async (req, res) => {
    try {
        const acs = await AC.findOne({ jvNum: req.params.id }).exec();
        console.log(acs);

        const level5s = await Level5.find().select({
            level5_code: 1,
            level5_title: 1,
            _id: 0,
        });

        res.render("acs/acv", {
            acs: acs,
            level5: level5s,
        });
    } catch {
        res.redirect("acs");
    }
});

router.delete("/:id", async (req, res) => {
    let ac;
    try {
        ac = await ac.findById(req.params.id);
        await ac.remove();
        res.redirect("/acs");
    } catch {
        if (ac == null) {
            res.redirect("/");
        } else {
            res.redirect(`/acs/${ac.id}`);
        }
    }
});

module.exports = router;
