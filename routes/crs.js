const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const CR = require("../models/cr");
const Level5 = require("../models/level5");
router.get("/test", (req, res)=>{
  res.render("crs/index")
  return  
})
// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.id != null && req.query.id !== "") {
    searchOptions.crNum = req.query.id;
  }
  try {
    const cr = {};
    if (searchOptions.crNum > 0) crs = await CR.find(searchOptions);
    else crs = new CR([{ crNum: 1212, crDate: Date.now(), transactions: [] }]);

    const level5s = await Level5.find().select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });
    res.render("crs/index", {
      crs: crs,
      level5: level5s,
      searchOptions: req.query,
    });
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

async function getNewCrNum() {
  const newCrNum = await CR.find({}).select({"crNum": 1, _id: 0}).sort({"crNum" : -1}).limit(1).exec();
    return ((newCrNum[0].crNum || 0) + 1);
}

// Create Author Route
router.post("/", async (req, res) => {
  try {
    console.log(req.body.crDate);
    if (req.body.crNum > 0) {
      const cr = await CR.findOne({ crNum: req.body.crNum }).exec();
      //console.log(cr)
      cr.crNum = req.body.crNum;
      cr.crDate = req.body.crDate;
      cr.transactions = req.body.transactions;

      const freshCr = await cr.save();
      console.log(freshCr);
      res.json({"ID": freshCr.crNum, "MSG": "Saved Successfully" })
      
    }
    else {
      let newCrNum = await getNewcrNum();

      console.log(newCrNum);

      const cr = new CR({
        crNum: newCrNum,
        crDate: req.body.crDate,
        transactions: req.body.transactions,
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
