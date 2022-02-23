const express = require("express");
const router = express.Router();
const GL = require("../models/gl");
const Level5 = require("../models/level5");
const shared = require("./shared")

router.get("/test", async (req, res) => {
    res.send("123")
    return;
})

// All Authors Route
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.id != null && req.query.id !== "") {
        searchOptions.jvNum = req.query.id;
    }
    try {
        const gl = {};
        if (searchOptions.jvNum > 0) gls = await GL.find(searchOptions);
        else gls = new GL([{ jvNum: 0, glNum: 0, glDate: Date.now(), transactions: [] }]);

        const level5s = await Level5.find().select({
            level5_code: 1,
            level5_title: 1,
            _id: 0,
        });


        const cashAcs = await Level5.find({ level4_code: 24502 }).select({
            level5_code: 1,
            level5_title: 1,
            _id: 0,
        });

        res.render("gls/glv", {
            gls: gls,
            level5: level5s,
            cashAcs: cashAcs,
            searchOptions: req.query,
        });
    } catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
});
// Create Author Route
router.post("/", async (req, res) => {
    try {
        if (req.body.jvNum > 0) {
            const gl = await GL.findOne({ jvNum: req.body.jvNum }).exec();
            //console.log(gl)
            gl.jvNum = req.body.jvNum;
            gl.glNum = req.body.glNum;
            gl.cashAc = req.body.cashAc;
            gl.jvDate = req.body.jvDate;
            gl.transactions = req.body.transactions;

            const freshGl = await gl.save();
            console.log(freshGl);
            res.json({ "ID": freshGl.jvNum, "MSG": "Saved Successfully" })

        }
        else {
            let newGlNum = await shared.getNewGlNum();
            let newJvNum = await shared.getNewJvNum();

            const gl = new GL({
                jvNum: newJvNum,
                glNum: newglNum,
                cashAc: req.body.cashAc,
                jvDate: req.body.jvDate,
                transactions: req.body.transactions
            });

            const freshGl = await gl.save();
            res.json({ "ID": freshGl.jvNum, "MSG": "Updated Successfully" })
        }

    } catch (err) {
        console.log(err);
        res.json({ "ID": 0, "MSG": err.message })
    }
});

router.get("/:id", async (req, res) => {
    try {
        const gls = await GL.findOne({ jvNum: req.params.id }).exec();
        console.log(crs);
        if (gls == null) {
            res.render("gls")
            return;
        }
        const level5s = await Level5.find().select({
            level5_code: 1,
            level5_title: 1,
            _id: 0,
        });

        const cashAcs = await Level5.find({ level4_code: 24502 }).select({
            level5_code: 1,
            level5_title: 1,
            _id: 0,
        });

        res.render("gls/glv", {
            gls: gls,
            cashAcs: cashAcs,
            level5: level5s,
        });
    } catch {
        res.redirect("gls");
    }
});

router.delete("/:id", async (req, res) => {
    let gl;
    try {
        gl = await gl.findById(req.params.id);
        await gl.remove();
        res.redirect("/gls");
    } catch {
        if (gl == null) {
            res.redirect("/");
        } else {
            res.redirect(`/gls/${gl.id}`);
        }
    }
});

module.exports = router;
