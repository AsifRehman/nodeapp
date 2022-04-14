const express = require("express");
const router = express.Router();
const PN = require("../models/pn");
const Level5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.id != null && req.query.id !== "") {
        searchOptions.jvNum = req.query.id;
    }
    try {
        const pn = {};
        if (searchOptions.jvNum > 0) pns = await PN.find(searchOptions);
        else pns = new PN([{ jvNum: 0, pnNum: 0, pnDate: Date.now(), transactions: [] }]);

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

        res.render("pns/pnv", {
            pns: pns,
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
        if (req.body.jvNum > 0) {
            const pn = await PN.findOne({ jvNum: req.body.jvNum }).exec();
            //console.log(pn)
            pn.jvNum = req.body.jvNum;
            pn.pnNum = req.body.pnNum;
            pn.cashAc = req.body.cashAc;
            pn.jvDate = req.body.jvDate;
            pn.transactions = req.body.transactions;

            const freshPn = await pn.save();
            console.log(freshPn);
            res.json({ "ID": freshPn.jvNum, "MSG": "Saved Successfully" })

        }
        else {
            let newPnNum = await shared.getNewPnNum();
            let newJvNum = await shared.getNewJvNum();

            const pn = new PN({
                jvNum: newJvNum,
                pnNum: newPnNum,
                cashAc: req.body.cashAc,
                jvDate: req.body.jvDate,
                transactions: req.body.transactions
            });

            const freshPn = await pn.save();
            res.json({ "ID": freshPn.jvNum, "MSG": "Updated Successfully" })
        }

    } catch (err) {
        console.log(err);
        res.json({ "ID": 0, "MSG": err.message })
    }
});

router.get("/:id", async (req, res) => {
    try {
        const pns = await PN.findOne({ jvNum: req.params.id }).exec();
        console.log(pns);
        if (pns == null) {
            res.render("pns")
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

        res.render("pns/pnv", {
            pns: pns,
            cashAcs: cashAcs,
            level5: level5s,
        });
    } catch {
        res.redirect("pns");
    }
});

router.delete("/:id", async (req, res) => {
    let pn;
    try {
        pn = await pn.findById(req.params.id);
        await pn.remove();
        res.redirect("/pns");
    } catch {
        if (pn == null) {
            res.redirect("/");
        } else {
            res.redirect(`/pns/${pn.id}`);
        }
    }
});

module.exports = router;
