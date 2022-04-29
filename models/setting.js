const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
  jvNum: {
    type: Number,
    required: true,
    unique: true
  },
  settingNum: {
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
    debit: {
      type: Number,
      required: false
    },
    credit: {
      type: Number,
      required: false
    }
  }]
})

module.exports = mongoose.model('settings', settingSchema)