const express = require("express");
const router = express.Router();
const JV = require("../models/jv");
const Level5 = require("../models/level5");

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.id != null && req.query.id !== "") {
    searchOptions.jvNum = req.query.id
  }
  try {
    const jvs = await JV.find(searchOptions);
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
  } catch {
    res.redirect("/");
  }
});

// New Author Route
router.get("/new", (req, res) => {
  res.render("jvs/new", { jv: new JV() });
});

// Create Author Route
router.post("/", async (req, res) => {
  try {
    const jv = new JV({
      jvNum: req.body.jvNum,
      jvDate: req.body.jvDate,
      transactions: req.body.transactions,
    });
    const newJV = await jv.save();
    res.status(200).redirect(`jvs/${jv.jvNum}`);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const jvs = await JV.find({jvNum: req.params.id}).exec();
    console.log(jvs)
    const level5s = await Level5.find().select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });
    res.render("jvs/index", {
      jvs: jvs,
      level5: level5s
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
