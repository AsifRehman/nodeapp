const mongoose = require('mongoose')


const level4Schema = new mongoose.Schema({
    level4_code: {
      type: Number,
      required: true,
      unique: true
    },
    level4_title: {
      type: String,
      required: true
    },
    level3_code: {
      type: Number,
      required: true
    }
    })


  module.exports = mongoose.model('level4', level4Schema)