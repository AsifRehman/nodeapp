const mongoose = require('mongoose')

const dmSchema = new mongoose.Schema({
    jvNum: {
        type: Number,
        required: true,
        unique: true
    },
    dmNum: {
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
        item_code: {
            type: Number,
            required: true
        },
        item_name: {
            type: String
        },
        description: {
            type: String
        },
        debit: {
            type: Number,
            required: false
        },
        stock: {
            type: Number,
            required: false
        },
        qty: {
            type: Number,
            required: false
        }
    }]
})

module.exports = mongoose.model('dms', dmSchema)