const express = require("express");
const router = express.Router();
const DM = require("../models/dm");
const Level5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.id != null && req.query.id !== "") {
        searchOptions.jvNum = req.query.id;
    }
    try {
        const dm = {};
        if (searchOptions.jvNum > 0) dms = await DM.find(searchOptions);
        else dms = new DM([{ jvNum: 0, dmNum: 0, dmDate: Date.now(), transactions: [] }]);

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

        res.render("dms/dmv", {
            dms: dms,
            level5: level5s,
            cashAcs: cashAcs,
            searchOptions: req.query,
        });
    } catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
});

// Create Author Route
router.post("/", async (req, res) => {
    try {
        //    console.log(req.body)

        if (req.body.jvNum > 0) {
            const dm = await DM.findOne({ jvNum: req.body.jvNum }).exec();
            //console.log(dm)
            dm.jvNum = req.body.jvNum;
            dm.dmNum = req.body.dmNum;
            dm.cashAc = req.body.cashAc;
            dm.jvDate = req.body.jvDate;
            dm.transactions = req.body.transactions;

            const freshDm = await dm.save();
            console.log(freshDm);
            res.json({ "ID": freshDm.jvNum, "MSG": "Saved Successfully" })

        }
        else {
            const newDmNum = await shared.getNewDmNum();
            const newJvNum = await shared.getNewJvNum();
            console.log(newDmNum)
            const dm = new DM({
                jvNum: newJvNum,
                dmNum: newDmNum,
                cashAc: req.body.cashAc,
                jvDate: req.body.jvDate,
                transactions: req.body.transactions
            });

            const freshDm = await dm.save();
            res.json({ "ID": freshDm.jvNum, "MSG": "Updated Successfully" })
        }

    } catch (err) {
        console.log(err);
        res.json({ "ID": 0, "MSG": err.message })
    }
});

router.get("/:id", async (req, res) => {
    try {
        const dms = await DM.findOne({ jvNum: req.params.id }).exec();
        console.log(dms);
        if (dms == null) {
            res.render("dms")
            return;
        }
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

        res.render("dms/dmv", {
            dms: dms,
            cashAcs: cashAcs,
            level5: level5s,
        });
    } catch {
        res.redirect("dms");
    }
});

router.delete("/:id", async (req, res) => {
    let dm;
    try {
        dm = await dm.findById(req.params.id);
        await dm.remove();
        res.redirect("/dms");
    } catch {
        if (dm == null) {
            res.redirect("/");
        } else {
            res.redirect(`/dms/${dm.id}`);
        }
    }
});

module.exports = router;
