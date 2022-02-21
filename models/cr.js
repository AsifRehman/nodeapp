const mongoose = require('mongoose')

const crSchema = new mongoose.Schema({
  jvNum: {
    type: Number,
    required: true,
    unique: true
  },
  crNum: {
    type: Number,
    required: true,
    unique: true
  },
  jvDate: {
    type: Date,
    required: true
  },
  cashAc: {
    type: Number,
    required: true
  },
  transactions: [{
    row_id: {
      type: Number
    },
    account_code: {
      type: Number,
      required: true
    },
    account_title: {
      type: String
    },
    narration: {
      type: String
    },
    credit: {
      type: Number,
      required: false
    }
  }]
})

module.exports = mongoose.model('crs', crSchema)