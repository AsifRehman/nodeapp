const express = require('express')
const router = express.Router()
const Level5 = require('../models/level5')

router.post('/get-account-balance', async (req, res) => {
    let account_code = req.body.account_code
    console.log(account_code)
    try {
        const level5 = await Level5.findOne({ "level5_code": account_code })
        if (level5.level5_code > 0) {
            let bal = level5.debit || 0;
            bal -= level5.credit || 0;

//            balDrCr = bal < 0 ? abs(bal) + " CR." : bal + " DR."

            res.status(200).json({ "BALANCE": bal.toString(), "AMOUNT": bal.toString() })
        }
        else
        {
            res.status(200).json({ "BALANCE": "0", "AMOUNT": "0" })
        }
        
    } catch (err) {
        res.status(200).json({ "BALANCE": "0", "AMOUNT": "0" })
    }

})


module.exports = router
