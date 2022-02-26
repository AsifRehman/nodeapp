const express = require("express");
const router = express.Router();
const CB = require("../models/cb");
const Level5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.id != null && req.query.id !== "") {
        searchOptions.jvNum = req.query.id;
    }
    try {
        const cb = {};
        if (searchOptions.jvNum > 0) cbs = await CB.find(searchOptions);
        else cbs = new CB([{ jvNum: 0, cbNum: 0, cbDate: Date.now(), transactions: [] }]);

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

        res.render("cbs/cbv", {
            cbs: cbs,
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
    console.log(req.body)
    res.send(req.body)
});

router.get("/:id", async (req, res) => {
    try {
        const cbs = await CB.findOne({ jvNum: req.params.id }).exec();
        console.log(cbs);
        if (cbs == null) {
            res.render("cbs")
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

        res.render("cbs/cbv", {
            cbs: cbs,
            cashAcs: cashAcs,
            level5: level5s,
        });
    } catch {
        res.redirect("cbs");
    }
});

router.delete("/:id", async (req, res) => {
    let cb;
    try {
        cb = await cb.findById(req.params.id);
        await cb.remove();
        res.redirect("/cbs");
    } catch {
        if (cb == null) {
            res.redirect("/");
        } else {
            res.redirect(`/cps/${cb.id}`);
        }
    }
});

module.exports = router;
