const bcrypt = require("bcrypt");
const User = require("../models/User");
const express = require("express");
const router = express.Router();


router.post("/login", async (req, res) => {
    const user = await User.findByName(req.body.name);

    if (!user) {
        return res.status(400).json({
            success: false,
            reason: "User not found."
        });
    }

    console.log(`${user.name} is trying to login`);

    console.log(user);
    console.log(req.body);

    try {
        const correct = await bcrypt.compare(req.body.password, user.pwHash);
        const jsonResponse = {success: correct ? true : false};

        if (!correct) {
            jsonResponse.reason = "Password incorrect.";
        }

        console.log(jsonResponse);



        res.json(jsonResponse);

    } catch (e) {
        console.log(e);
    }
});


module.exports = router;
