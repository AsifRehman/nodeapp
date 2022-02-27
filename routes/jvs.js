const express = require("express");
const router = express.Router();
const JV = require("../models/jv");
const Level5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.id != null && req.query.id !== "") {
    searchOptions.jvNum = req.query.id;
  }
  try {
    if (searchOptions.jvNum > 0) jvs = await JV.find(searchOptions);
    else jvs = new JV([{ jvNum: 1212, jvDate: Date.now(), transactions: [] }]);

    const level5s = await Level5.find().select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });
    res.render("jvs/jvv", {
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
    console.log(req.body.jvDate);
    if (req.body.jvNum > 0) {
      const jv = await JV.findOne({ jvNum: req.body.jvNum }).exec();
      //console.log(jv)
      jv.jvNum = req.body.jvNum;
      jv.jvDate = req.body.jvDate;
      jv.transactions = req.body.transactions;

      const freshJv = await jv.save();
      console.log(freshJv);
      res.json({ "ID": freshJv.jvNum, "MSG": "Saved Successfully" })

    }
    else {
      const newJvNum = await shared.getNewJvNum();

      console.log(newJvNum);

      const jv = new JV({
        jvNum: newJvNum,
        jvDate: req.body.jvDate,
        transactions: req.body.transactions,
      });
      if (data["ID"] == 0) {
        $(".save_voucher").prop("disabled", false);
        $("#screenLocked").modal("hide");
        displayMessage(data["MSG"]);
      } else {
        //$(".save_voucher").prop("disabled",false);
        displayMessage(data["MSG"]);
        $("#screenLocked").modal("hide");
        window.location.href = "/jvs/" + data["ID"];
      }

      const freshJv = await jv.save();
      res.json({ "ID": freshJv.jvNum, "MSG": "Updated Successfully" })
    }

  } catch (err) {
    console.log(err);
    res.json({ "ID": 0, "MSG": err.message })
  }
});

router.get("/:id", async (req, res) => {
  try {
    const jvs = await JV.findOne({ jvNum: req.params.id }).exec();
    console.log(jvs);
    if (jvs == null) {
      res.render("jvs")
      return;
    }
    const level5s = await Level5.find().select({
      level5_code: 1,
      level5_title: 1,
      _id: 0,
    });
    res.render("jvs/jvv", {
      jvs: jvs,
      level5: level5s,
    });
  } catch {
    res.redirect("jvs");
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
