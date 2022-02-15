const mongoose = require('mongoose')


const level3Schema = new mongoose.Schema({
    level3_code: {
      type: Number,
      required: true,
      unique: true
    },
    level3_title: {
      type: String,
      required: true
    },
    level2_code: {
      type: Number,
      required: true
    }
    })


  module.exports = mongoose.model('level3', level3Schema)