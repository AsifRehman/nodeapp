const express = require("express");
const router = express.Router();

const CR = require("../models/cr");
const GL = require("../models/gl");
const CP = require("../models/cp");
const JV = require("../models/jv");
const COMP = require("../models/company");

router.get('/test', async (req, res) => {
    const tbl = await JV.find().exec()
    res.json(tbl)
})

router.get('/:id', async (req, res) => {

    let comp = await COMP.findOne({ companyId: 1 }).exec();

    let tbl = await JV.findOne({ jvNum: req.params.id }).exec();
    if (tbl != null) {
        const title = "Journal Voucher"
        res.render("printv", { layout: false, jvs: tbl, title: title, comp: comp })
        return;
    }

    tbl = await CR.findOne({ jvNum: req.params.id }).exec();
    if (tbl != null) {
        const title = "Cash Receipt"
        res.render("printv", { layout: false, jvs: tbl, title: title, comp: comp })
        return;
    }

    tbl = await CP.findOne({ jvNum: req.params.id }).exec();
    if (tbl != null) {
        const title = "Cash Payment"
        res.render("printv", { layout: false, jvs: tbl, title: title, comp: comp })
        return;
    }

})


module.exports = router