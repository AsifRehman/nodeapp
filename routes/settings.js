const express = require("express");
const router = express.Router();
const SETTING = require("../models/setting");
const Level5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.id != null && req.query.id !== "") {
        searchOptions.jvNum = req.query.id;
    }
    try {
        const setting = {};
        if (searchOptions.jvNum > 0) settings = await SETTING.find(searchOptions);
        else settings = new SETTING([{ jvNum: 0, settingNum: 0, settingDate: Date.now(), transactions: [] }]);

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

        res.render("settings/settingv", {
            settings: settings,
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
            const setting = await SETTING.findOne({ jvNum: req.body.jvNum }).exec();
            //console.log(setting)
            setting.jvNum = req.body.jvNum;
            setting.settingNum = req.body.settingNum;
            setting.cashAc = req.body.cashAc;
            setting.jvDate = req.body.jvDate;
            setting.transactions = req.body.transactions;

            const freshCp = await setting.save();
            console.log(freshCp);
            res.json({ "ID": freshCp.jvNum, "MSG": "Saved Successfully" })

        }
        else {
            const newCpNum = await shared.getNewCpNum();
            const newJvNum = await shared.getNewJvNum();
            console.log(newCpNum)
            const setting = new SETTING({
                jvNum: newJvNum,
                settingNum: newCpNum,
                cashAc: req.body.cashAc,
                jvDate: req.body.jvDate,
                transactions: req.body.transactions
            });

            const freshCp = await setting.save();
            res.json({ "ID": freshCp.jvNum, "MSG": "Updated Successfully" })
        }

    } catch (err) {
        console.log(err);
        res.json({ "ID": 0, "MSG": err.message })
    }
});

router.get("/:id", async (req, res) => {
    try {
        const settings = await SETTING.findOne({ jvNum: req.params.id }).exec();
        console.log(settings);
        if (settings == null) {
            res.render("settings")
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

        res.render("settings/settingv", {
            settings: settings,
            cashAcs: cashAcs,
            level5: level5s,
        });
    } catch {
        res.redirect("settings");
    }
});

router.delete("/:id", async (req, res) => {
    let setting;
    try {
        setting = await setting.findById(req.params.id);
        await setting.remove();
        res.redirect("/settings");
    } catch {
        if (setting == null) {
            res.redirect("/");
        } else {
            res.redirect(`/settings/${setting.id}`);
        }
    }
});

module.exports = router;
