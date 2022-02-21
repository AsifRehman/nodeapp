const express = require("express");
const router = express.Router();
const CP = require("../models/cp");
const Level5 = require("../models/level5");
// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.id != null && req.query.id !== "") {
    searchOptions.cpNum = req.query.id;
  }
  try {
    const cp = {};
    if (searchOptions.cpNum > 0) cps = await CP.find(searchOptions);
    else cps = new CP([{ cpNum: 1212, cpDate: Date.now(), transactions: [] }]);

    const level5s = await Level5.find().select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });
    res.render("cps/index", {
      cps: cps,
      level5: level5s,
      searchOptions: req.query,
    });
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

async function getNewcpNum() {
  const newcpNum = await CP.find({}).select({"cpNum": 1, _id: 0}).sort({"cpNum" : -1}).limit(1).exec();
    return ((newcpNum[0].cpNum || 0) + 1);
}

// Create Author Route
router.post("/", async (req, res) => {
  try {
    console.log(req.body.cpDate);
    if (req.body.cpNum > 0) {
      const cp = await cp.findOne({ cpNum: req.body.cpNum }).exec();
      //console.log(cp)
      cp.cpNum = req.body.cpNum;
      cp.cpDate = req.body.cpDate;
      cp.transactions = req.body.transactions;

      const freshcp = await cp.save();
      console.log(freshcp);
      res.json({"ID": freshcp.cpNum, "MSG": "Saved Successfully" })
      
    }
    else {
      let newcpNum = await getNewcpNum();

      console.log(newcpNum);

      const cp = new CP({
        cpNum: newcpNum,
        cpDate: req.body.cpDate,
        transactions: req.body.transactions,
      });

      const freshcp = await cp.save();
      res.json({"ID": freshcp.cpNum, "MSG": "Updated Successfully" })
    }

  } catch (err) {
    console.log(err);
    res.json({"ID": 0, "MSG": err.message })
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cps = await CP.findOne({ cpNum: req.params.id }).exec();
    console.log(cps);
    if(cps == null) {
      res.render("cps")
      return;
    }
    const level5s = await Level5.find().select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });
    res.render("cps", {
      cps: cps,
      level5: level5s,
    });
  } catch {
    res.redirect("cps");
  }
});

router.delete("/:id", async (req, res) => {
  let cp;
  try {
    cp = await CP.findById(req.params.id);
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
