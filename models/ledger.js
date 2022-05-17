const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
  jvNum: {
    type: Number,
    required: true,
    unique: true
  },
  jvDate: {
    type: Date,
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
    ttype: {
      type: String
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

module.exports = mongoose.model('ledger', ledgerSchema)