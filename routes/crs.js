const express = require("express");
const router = express.Router();
const CR = require("../models/cr");
const Level5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.id != null && req.query.id !== "") {
    searchOptions.jvNum = req.query.id;
  }
  try {
    const cr = {};
    if (searchOptions.jvNum > 0) crs = await CR.find(searchOptions);
    else crs = new CR([{ jvNum: 0, crNum: 0, crDate: Date.now(), transactions: [] }]);

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

    res.render("crs/crv", {
      crs: crs,
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
      const cr = await CR.findOne({ jvNum: req.body.jvNum }).exec();
      //console.log(cr)
      cr.jvNum = req.body.jvNum;
      cr.crNum = req.body.crNum;
      cr.cashAc = req.body.cashAc;
      cr.jvDate = req.body.jvDate;
      cr.transactions = req.body.transactions;

      const freshCr = await cr.save();
      console.log(freshCr);
      res.json({ "ID": freshCr.jvNum, "MSG": "Saved Successfully" })

    }
    else {
      let newCrNum = await shared.getNewCrNum();
      let newJvNum = await shared.getNewJvNum();

      const cr = new CR({
        jvNum: newJvNum,
        crNum: newCrNum,
        cashAc: req.body.cashAc,
        jvDate: req.body.jvDate,
        transactions: req.body.transactions
      });

      const freshCr = await cr.save();
      res.json({ "ID": freshCr.jvNum, "MSG": "Updated Successfully" })
    }

  } catch (err) {
    console.log(err);
    res.json({ "ID": 0, "MSG": err.message })
  }
});

router.get("/:id", async (req, res) => {
  try {
    const crs = await CR.findOne({ jvNum: req.params.id }).exec();
    console.log(crs);
    if (crs == null) {
      res.render("crs")
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

    res.render("crs/crv", {
      crs: crs,
      cashAcs: cashAcs,
      level5: level5s,
    });
  } catch {
    res.redirect("crs");
  }
});

router.delete("/:id", async (req, res) => {
  let cr;
  try {
    cr = await cr.findById(req.params.id);
    await cr.remove();
    res.redirect("/crs");
  } catch {
    if (cr == null) {
      res.redirect("/");
    } else {
      res.redirect(`/crs/${cr.id}`);
    }
  }
});

module.exports = router;
