const express = require("express");
const router = express.Router();
const L1 = require("../models/level1");
const L2 = require("../models/level2");
const L3 = require("../models/level3");
const L4 = require("../models/level4");
const L5 = require("../models/level5");
const shared = require("./shared")

// All Authors Route
router.get("/", async (req, res) => {

  try {


    levels = await L1.aggregate([
      { 
        $set: { level: 1 } 
      },
      { 
        $project: {_id: 0, level: 1, 'acc_code': { $toString: "$level1_code" }, 'parent_code': {$toString: "0"}, 'acc_title': "$level1_title"  }
      },
      {
        $unionWith: { coll: "level2", pipeline: [{ $set: { level: 2 } }, {$project: {_id: 0, level: 1, 'acc_code': {$toString: "$level2_code" }, 'parent_code': {$toString: "$level1_code"}, 'acc_title': "$level2_title" }}] }
      },
      {
        $unionWith: { coll: "level3", pipeline: [{ $set: { level: 3 } }, {$project: {_id: 0, level: 1, 'acc_code': {$toString: "$level3_code" }, 'parent_code': {$toString: "$level2_code"}, 'acc_title': "$level3_title" }}] }
      },
      {
        $unionWith: { coll: "level4", pipeline: [{ $set: { level: 4 } }, {$project: {_id: 0, level: 1, 'acc_code': {$toString: "$level4_code" }, 'parent_code': {$toString: "$level3_code"}, 'acc_title': "$level4_title" }}] }
      },
      {
        $unionWith: { coll: "level5", pipeline: [{ $set: { level: 5 } }, {$project: {_id: 0, level: 1, 'acc_code': {$toString: "$level5_code" }, 'parent_code': {$toString: "$level4_code"}, 'acc_title': "$level5_title" }}] }
      },
      { $sort: { acc_code: 1 } },
    ]);
    //console.log(levels)
    l1 = await L1.find()
    l2 = await L2.find()
    l3 = await L3.find()
    l4 = await L4.find()

    res.render("acmgmt/acmgmt", {
      levels: levels,
      l1: l1,
      l2: l2,
      l3: l3,
      l4: l4
    });
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
});

router.post("/", async (req, res)=> {
  console.log(req.body)

  const level4_code = req.body.l4;
  const getLastL5 = await L5.findOne().select({ "level5_code": 1, _id: 0 }).where({"level4_code": level4_code}).sort({ "level5_code": -1 }).limit(1).exec();
  if (getLastL5 == null)
    getNewL5 = level4_code + "0001"
  else
    getNewL5 = parseInt(getLastL5.level5_code) + 1
  
    const l5 = new L5({
    level5_code: getNewL5,
    level5_title: req.body.title.trim(),
    level4_code: req.body.l4,
  });

  const freshL5 = await l5.save();
  res.json({ "ID": getNewL5, "MSG": "Updated Successfully" })

});

router.post("/update", async (req, res)=> {
  acc_level = req.body.acc_level.trim()
  acc_code = req.body.acc_code.trim()
  acc_title = req.body.new_title.trim()
  console.log(acc_level)
  filter = null
  update = null

  if (acc_level == "5") {
    filter = {'level5_code': acc_code};
    update = {'level5_title' : acc_title}
    const updatedL5 = await L5.updateOne(filter, update)
    res.send({"OK": "Y"})
    return;
  }
  //Level 4
  if (acc_level == "4") {
    filter = {'level4_code': acc_code};
    update = {'level4_title' : acc_title}
    const updatedL4 = await L4.updateOne(filter, update)
    res.send({"OK": "Y"})
    return;
  }

  //Level 3
  if (acc_level == "3") {
    filter = {'level3_code': acc_code};
    update = {'level3_title' : acc_title}
    const updatedL3 = await L3.updateOne(filter, update)
    res.send({"OK": "Y"})
    return;
  }

  //Level 2
  if (acc_level == "2") {
    filter = {'level2_code': acc_code};
    update = {'level2_title' : acc_title}
    const updatedL2 = await L2.updateOne(filter, update)
    res.send({"OK": "Y"})
    return;
  }

  //Level 1
  if (acc_level == "1") {
    filter = {'level1_code': acc_code};
    update = {'level1_title' : acc_title}
    const updatedL1 = await L1.updateOne(filter, update)
    res.send({"OK": "Y"})
    return;
  }

  res.send({"OK": "N"})
});

module.exports = router;
