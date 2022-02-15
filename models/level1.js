const mongoose = require('mongoose')


const level1Schema = new mongoose.Schema({
    level1_code: {
      type: Number,
      required: true,
      unique: true
    },
    level1_title: {
      type: String,
      required: true
    }
  })


  module.exports = mongoose.model('level1', level1Schema)