const mongoose = require('mongoose')


const level5Schema = new mongoose.Schema({
    level5_code: {
      type: Number,
      required: true,
      unique: true
    },
    level5_title: {
      type: String,
      required: true
    },
    level4_code: {
      type: Number,
      required: true
    },
    debit: {
      type: Number
    },
    credit: {
      type: Number
    },
    })


  module.exports = mongoose.model('level5', level5Schema)