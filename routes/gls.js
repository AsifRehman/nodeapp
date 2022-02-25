const express = require("express");
const router = express.Router();
const GL = require("../models/gl");
const JV = require("../models/jv");
const Level5 = require("../models/level5");
const shared = require("./shared")
const COMP = require("../models/company");
const level5 = require("../models/level5");

// All Authors Route
router.get("/", async (req, res) => {
    let comp = await COMP.findOne({ companyId: 1 }).exec();

    let opt = {};
    if (req.query.accountCode != null && req.query.accountCode !== "") {
        opt.account_code = req.query.accountCode;
    }
    if (req.query.fromDate != null && req.query.fromDate !== "") {
        opt.fromDate = req.query.fromDate;
    }
    if (req.query.toDate != null && req.query.toDate !== "") {
        opt.toDate = req.query.toDate;
    }

    try {
        let level5 = {};

        if (opt.account_code > 0) {
            level5 = await Level5.findOne({level5_code: opt.account_code}).exec();

//            gls = await JV.find({});
            gls = await JV.find({
                'transactions.account_code': opt.account_code,
                'jvDate': {$gte: shared.revDate(opt.fromDate), $lte: shared.revDate(opt.toDate)}

            });

            
        }
        else {
            gls = [];
        }

        const level5s = await Level5.find().select({
            level5_code: 1,
            level5_title: 1,
            _id: 0,
        });


        res.render("gls/glv", {
            gls: gls,
            account_code: opt.account_code,
            account_title: level5.level5_title,
            comp: comp,
            level5: level5s,
            opt: opt,
        });
    } catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
});

module.exports = router;
