const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const CR = require("../models/cr");
const JV = require("../models/jv");
const Level5 = require("../models/level5");

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.id != null && req.query.id !== "") {
    searchOptions.jvNum = req.query.id;
  }
  try {
    const cr = {};
    if (searchOptions.jvNum > 0) crs = await CR.find(searchOptions);
    else crs = new CR([{ jvNum:0, crNum: 0, crDate: Date.now(), transactions: [] }]);

    const level5s = await Level5.find().select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });


    const cashAcs = await Level5.find({level4_code: 24502}).select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });

    res.render("crs/index", {
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

async function getNewCrNum() {
  const newCrNum = await CR.findOne().select({"crNum": 1, _id: 0}).sort({"crNum" : -1}).limit(1).exec();
  return newCrNum == null ? 0 : newCrNum.jvNum + 1;
}
router.get('/max', async (req,res) => {
  v = await getNewJvNum()
  res.send(v.toString())
});

async function getNewJvNum() {
  const newJvNum1 = await JV.findOne().select({"jvNum": 1, _id: 0}).sort({"jvNum" : -1}).limit(1).exec();
  const newJvNum2 = await CR.findOne().select({"jvNum": 1, _id: 0}).sort({"jvNum" : -1}).limit(1).exec();
  let v1 = newJvNum1 == null ? 0 : newJvNum1.jvNum + 1;
  let v2 = newJvNum2 == null ? 0 : newJvNum2.jvNum + 1;
  return Math.max(v1,v2);
}

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

      req.body.transactions.forEach(e => {
        e.row_id = 0;
        e.account_code = e.account_code;
        e.account_title = e.account_title;
        e.narration = e.narration;
        cr.transactions.push(e)
        console.log(e)
      });

      return;

      const freshCr = await cr.save();
      console.log(freshCr);
      res.json({"ID": freshCr.jvNum, "MSG": "Saved Successfully" })
      
    }
    else {
      let newCrNum = await getNewCrNum();
      let newJvNum = await getNewJvNum();

      const cr = new CR({
        jvNum: newJvNum,
        crNum: newCrNum,
        cashAc: 245020001,
        jvDate: req.body.jvDate,
      });

      req.body.transactions.forEach(e => {
        e.row_id = 0;
        e.account_code = e.account_code;
        e.account_title = e.account_title;
        e.narration = e.narration;
        cr.transactions.push(e)
        console.log(e)
      });

      const freshCr = await cr.save();
      res.json({"ID": freshcr.crNum, "MSG": "Updated Successfully" })
    }

  } catch (err) {
    console.log(err);
    res.json({"ID": 0, "MSG": err.message })
  }
});

router.get("/:id", async (req, res) => {
  try {
    const crs = await CR.findOne({ crNum: req.params.id }).exec();
    console.log(crs);
    if(crs == null) {
      res.render("crs")
      return;
    }
    const level5s = await Level5.find().select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });
    res.render("crs", {
      crs: crs,
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
