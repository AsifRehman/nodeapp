const express = require("express");
const router = express.Router();

const JV = require("../models/jv");

router.get('/test', async(req, res)=> {
    const tbl = await JV.find().exec()
    res.json(tbl)
})

router.get('/:id', async(req,res)=> {
    const tbl = await JV.findOne({jvNum: req.params.id}).exec();
    //res.json(tbl)
    res.render("printv", {layout: false, jvs: tbl})
})


module.exports = router