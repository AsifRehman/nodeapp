const express = require("express");
const router = express.Router();
const PL = require("../models/pl");
const Level5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.id != null && req.query.id !== "") {
        searchOptions.jvNum = req.query.id;
    }
    try {
        const pl = {};
        if (searchOptions.jvNum > 0) pls = await PL.find(searchOptions);
        else pls = new PL([{ jvNum: 0, plNum: 0, plDate: Date.now(), transactions: [] }]);

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

        res.render("pls/plv", {
            pls: pls,
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
            const pl = await PL.findOne({ jvNum: req.body.jvNum }).exec();
            //console.log(pl)
            pl.jvNum = req.body.jvNum;
            pl.jvDate = req.body.jvDate;
            pl.transactions = req.body.transactions;

            const freshPl = await pl.save();
            console.log(freshPl);
            res.json({ "ID": freshPl.jvNum, "MSG": "Saved Successfully" })

        }
        else {
            const newJvNum = await shared.getNewJvNum();

            console.log(newJvNum);

            const pl = new PL({
                jvNum: newJvNum,
                jvDate: req.body.jvDate,
                transactions: req.body.transactions,
            });

            const freshPl = await pl.save();
            res.json({ "ID": freshPl.jvNum, "MSG": "Updated Successfully" })
        }

    } catch (err) {
        console.log(err);
        res.json({ "ID": 0, "MSG": err.message })
    }
});




router.get("/:id", async (req, res) => {
    try {
        const pls = await PL.findOne({ jvNum: req.params.id }).exec();
        console.log(pls);

        const level5s = await Level5.find().select({
            level5_code: 1,
            level5_title: 1,
            _id: 0,
        });

        res.render("pls/plv", {
            pls: pls,
            level5: level5s,
        });
    } catch {
        res.redirect("pls");
    }
});

router.delete("/:id", async (req, res) => {
    let pl;
    try {
        pl = await pl.findById(req.params.id);
        await pl.remove();
        res.redirect("/pls");
    } catch {
        if (pl == null) {
            res.redirect("/");
        } else {
            res.redirect(`/pls/${pl.id}`);
        }
    }
});

module.exports = router;
