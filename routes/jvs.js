const express = require("express");
const router = express.Router();
const JV = require("../models/jv");
const Level5 = require("../models/level5");

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.id != null && req.query.id !== "") {
    searchOptions.jvNum = req.query.id;
  }
  try {
    const jv = {};
    if (searchOptions.jvNum > 0) jvs = await JV.find(searchOptions);
    else jvs = new JV([{ jvNum: 1212, jvDate: Date.now(), transactions: [] }]);

    const level5s = await Level5.find().select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });
    res.render("jvs/index", {
      jvs: jvs,
      level5: level5s,
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
    console.log(req.body.transactions);
    if (req.body.jvNum > 0) {
      const jv = await JV.findOne({ jvNum: req.body.jvNum }).exec();
      //console.log(jv)
      jv.jvNum = req.body.jvNum;
      jv.jvDate = req.body.jvDate;
      jv.transactions = req.body.transactions;

      const freshJv = await jv.save();
      console.log(freshJv);
      res.status(200).redirect(`jvs/${freshJv.jvNum}`);
    }
    else {
      const jv = new JV({
        jvNum: req.body.jvNum,
        jvDate: req.body.jvDate,
        transactions: req.body.transactions,
      });

      const freshJv = await jv.save();
      res.status(200).redirect(`jvs/${freshJv.jvNum}`);      
    }

  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const jvs = await JV.find({ jvNum: req.params.id }).exec();
    const level5s = await Level5.find().select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });
    res.render("jvs/index", {
      jvs: jvs,
      level5: level5s,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const jv = await JV.findById(req.params.id);
    res.render("jvs/edit", { jv: jv });
  } catch {
    res.redirect("/jvs/index");
  }
});

router.put("/:id", async (req, res) => {
  let jv;
  try {
    jv = await JV.findById(req.params.id);
    jv.name = req.body.name;
    await jv.save();
    res.redirect(`/jvs/${jv.id}`);
  } catch {
    if (jv == null) {
      res.redirect("/");
    } else {
      res.render("jvs/edit", {
        jv: jv,
        errorMessage: "Error updating JV",
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  let jv;
  try {
    jv = await JV.findById(req.params.id);
    await jv.remove();
    res.redirect("/jvs");
  } catch {
    if (jv == null) {
      res.redirect("/");
    } else {
      res.redirect(`/jvs/${jv.id}`);
    }
  }
});

module.exports = router;
