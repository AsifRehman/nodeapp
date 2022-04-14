const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://m001-student:cosoftcon123@sandbox.xxmxh.mongodb.net/ac22?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const JV = require("./models/jv");
const CR = require("./models/cr");
let abc = JV.find({jvNum: {$gt: 0}});
console.log(abc.length);