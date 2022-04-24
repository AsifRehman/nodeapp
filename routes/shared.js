const CR = require("../models/cr");
const CP = require("../models/cp");
const JV = require("../models/jv");
const CB = require("../models/cb")

async function getNewCbNum() {
    const newCbNum = await CB.findOne().select({ "cbNum": 1, _id: 0 }).sort({
        "cbNum": -1

    }).limit(1).exec();
    console.log("inside getnewCBNum" + newCbNum)
    return newCbNum == null ? 0 : newCbNum.cbNum + 1;
}



async function getNewCrNum() {
    const newCrNum = await CR.findOne().select({ "crNum": 1, _id: 0 }).sort({
        "crNum": -1

    }).limit(1).exec();
    return newCrNum == null ? 0 : newCrNum.crNum + 1;
}

async function getNewCpNum() {
    const newCpNum = await CP.findOne().select({ "cpNum": 1, _id: 0 }).sort({
        "cpNum": -1

    }).limit(1).exec();
    console.log("inside getnewCPNum" + newCpNum)
    return newCpNum == null ? 0 : newCpNum.cpNum + 1;
}

async function getNewJvNum() {
    const newJvNum1 = await JV.findOne().select({ "jvNum": 1, _id: 0 }).sort({
        "jvNum": -1

    }).limit(1).exec();
    const newJvNum2 = await CR.findOne().select({ "jvNum": 1, _id: 0 }).sort({
        "jvNum": -1

    }).limit(1).exec();
    const newJvNum3 = await CP.findOne().select({ "jvNum": 1, _id: 0 }).sort({
        "jvNum": -1

    }).limit(1).exec();
    const newJvNum4 = await CB.findOne().select({ "jvNum": 1, _id: 0 }).sort({
        "jvNum": -1

    }).limit(1).exec();
    let v1 = newJvNum1 == null ? 0 : newJvNum1.jvNum + 1;
    let v2 = newJvNum2 == null ? 0 : newJvNum2.jvNum + 1;
    let v3 = newJvNum3 == null ? 0 : newJvNum3.jvNum + 1;
    let v4 = newJvNum4 == null ? 0 : newJvNum4.jvNum + 1;
    return Math.max(v1, v2, v3, v4);
}

function revDate(dt) {
    return dt.split("-").reverse().join("-")
}

function getToday() {
    return new Date().getDate().toString().padStart(2, '0') + '-' + (new Date().getMonth

        () + 1).toString().padStart(2, '0') + '-' + new Date().getFullYear().toString();
    return new Date().getDate().toString().padStart(2,'0') + '-' + (new Date().getMonth()+1).toString().padStart(2,'0') + '-' + new Date().getFullYear().toString();
}

function dated(dt) {
    a = dt.split("-").reverse()
    console.log(a)
    return new Date(a[0], a[1] - 1, parseInt(a[2])+1)
}

module.exports = {
    getNewCrNum: getNewCrNum,
    getNewCpNum: getNewCpNum,
    getNewJvNum: getNewJvNum,
    getNewCbNum: getNewCbNum,
    revDate: revDate,
    dated: dated,
    getToday: getToday
}