const express = require("express");
const router = express.Router();
const PR = require("../models/pr");
const Level5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.id != null && req.query.id !== "") {
        searchOptions.jvNum = req.query.id;
    }
    try {
        const pr = {};
        if (searchOptions.jvNum > 0) prs = await PR.find(searchOptions);
        else prs = new PR([{ jvNum: 0, prNum: 0, prDate: Date.now(), transactions: [] }]);

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

        res.render("prs/prv", {
            prs: prs,
            level5: level5s,
            cashAcs: cashAcs,
            searchOptions: req.query,
        });
    } catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
});

// Preate Author Route
router.post("/", async (req, res) => {
    try {
        if (req.body.jvNum > 0) {
            const pr = await PR.findOne({ jvNum: req.body.jvNum }).exec();
            //console.log(pr)
            pr.jvNum = req.body.jvNum;
            pr.prNum = req.body.prNum;
            pr.cashAc = req.body.cashAc;
            pr.jvDate = req.body.jvDate;
            pr.transactions = req.body.transactions;

            const freshPr = await pr.save();
            console.log(freshPr);
            res.json({ "ID": freshPr.jvNum, "MSG": "Saved Successfully" })

        }
        else {
            let newPrNum = await shared.getNewPrNum();
            let newJvNum = await shared.getNewJvNum();

            const pr = new PR({
                jvNum: newJvNum,
                prNum: newPrNum,
                cashAc: req.body.cashAc,
                jvDate: req.body.jvDate,
                transactions: req.body.transactions
            });

            const freshPr = await pr.save();
            res.json({ "ID": freshPr.jvNum, "MSG": "Updated Successfully" })
        }

    } catch (err) {
        console.log(err);
        res.json({ "ID": 0, "MSG": err.message })
    }
});

router.get("/:id", async (req, res) => {
    try {
        const prs = await PR.findOne({ jvNum: req.params.id }).exec();
        console.log(prs);
        if (prs == null) {
            res.render("prs")
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

        res.render("prs/prv", {
            prs: prs,
            cashAcs: cashAcs,
            level5: level5s,
        });
    } catch {
        res.redirect("prs");
    }
});

router.delete("/:id", async (req, res) => {
    let pr;
    try {
        pr = await pr.findById(req.params.id);
        await pr.remove();
        res.redirect("/prs");
    } catch {
        if (pr == null) {
            res.redirect("/");
        } else {
            res.redirect(`/prs/${pr.id}`);
        }
    }
});

module.exports = router;
