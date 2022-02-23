const express = require("express");
const router = express.Router();
const CP = require("../models/cp");
const Level5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.id != null && req.query.id !== "") {
    searchOptions.jvNum = req.query.id;
  }
  try {
    const cp = {};
    if (searchOptions.jvNum > 0) cps = await CP.find(searchOptions);
    else cps = new CP([{ jvNum: 0, cpNum: 0, crDate: Date.now(), transactions: [] }]);

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

    res.render("cps/cpv", {
      cps: cps,
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
      const cp = await CP.findOne({ jvNum: req.body.jvNum }).exec();
      //console.log(cr)
      cp.jvNum = req.body.jvNum;
      cp.crNum = req.body.cpNum;
      cp.cashAc = req.body.cashAc;
      cp.jvDate = req.body.jvDate;
      cp.transactions = req.body.transactions;

      const freshCr = await cp.save();
      console.log(freshCr);
      res.json({ "ID": freshCr.jvNum, "MSG": "Saved Successfully" })

    }
    else {
      let newcpNum = await shared.getNewCrNum();
      let newJvNum = await shared.getNewJvNum();

      const cp = new CR({
        jvNum: newJvNum,
        cpNum: newcpNum,
        cashAc: req.body.cashAc,
        jvDate: req.body.jvDate,
        transactions: req.body.transactions
      });

      const freshCr = await cp.save();
      res.json({ "ID": freshCr.jvNum, "MSG": "Updated Successfully" })
    }

  } catch (err) {
    console.log(err);
    res.json({ "ID": 0, "MSG": err.message })
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cps = await CP.findOne({ jvNum: req.params.id }).exec();
    console.log(cps);
    if (cps == null) {
      res.render("cps")
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

    res.render("cps/cpv", {
      cps: cps,
      cashAcs: cashAcs,
      level5: level5s,
    });
  } catch {
    res.redirect("cps");
  }
});

router.delete("/:id", async (req, res) => {
  let cp;
  try {
    cp = await cp.findById(req.params.id);
    await cp.remove();
    res.redirect("/cps");
  } catch {
    if (cp == null) {
      res.redirect("/");
    } else {
      res.redirect(`/cps/${cp.id}`);
    }
  }
});

module.exports = router;
