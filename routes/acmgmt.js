const express = require("express");
const router = express.Router();
const L1 = require("../models/level1");
const L2 = require("../models/level2");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {

  try {


    levels = await L1.aggregate([
      { 
        $set: { level: 1 } 
      },
      { 
        $project: {_id: 0, level: 1, 'acc_code': { $toString: "$level1_code" }, 'acc_title': "$level1_title"  }
      },
      {
        $unionWith: { coll: "level2", pipeline: [{ $set: { level: 2 } }, {$project: {_id: 0, level: 1, 'acc_code': {$toString: "$level2_code" }, 'acc_title': "$level2_title" }}] }
      },
      {
        $unionWith: { coll: "level3", pipeline: [{ $set: { level: 3 } }, {$project: {_id: 0, level: 1, 'acc_code': {$toString: "$level3_code" }, 'acc_title': "$level3_title" }}] }
      },
      {
        $unionWith: { coll: "level4", pipeline: [{ $set: { level: 4 } }, {$project: {_id: 0, level: 1, 'acc_code': {$toString: "$level4_code" }, 'acc_title': "$level4_title" }}] }
      },
      {
        $unionWith: { coll: "level5", pipeline: [{ $set: { level: 4 } }, {$project: {_id: 0, level: 1, 'acc_code': {$toString: "$level5_code" }, 'acc_title': "$level5_title" }}] }
      },
      { $sort: { acc_code: 1 } },
    ]);
    console.log(levels)

    res.render("acmgmt/acmgmt", {
      levels: levels
    });
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

module.exports = router;
