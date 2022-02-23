const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    companyId: {
        type: Number,
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
})

module.exports = mongoose.model('companies', companySchema)