const mongoose = require('mongoose')

const pnSchema = new mongoose.Schema({
    jvNum: {
        type: Number,
        required: true,
        unique: true
    },
    pnNum: {
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
        pnedit: {
            type: Number,
            required: false
        }
    }]
})

module.exports = mongoose.model('pns', pnSchema)