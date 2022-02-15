const mongoose = require('mongoose')


const level2Schema = new mongoose.Schema({
    level2_code: {
      type: Number,
      required: true,
      unique: true
    },
    level2_title: {
      type: String,
      required: true
    },
    level1_code: {
      type: Number,
      required: true
    }
    })


  module.exports = mongoose.model('level2', level2Schema)