const User = require("../models/User");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();


router.post("/register", async (req, res) => {
    try {
        const { name } = req.body;

        if (!User.isValidName(name)) {
            return res.json({
                success: false,
                reason: "Name must be atleast 3 chars long, max 19"
            });
        }

        const nameAvailable = await User.isUsernameFree(name);
        console.log(nameAvailable);

        if (!nameAvailable || name.toLowerCase() === "undefined" || name.toLowerCase() === "null") {
            return res.json({
                success: false,
                reason: !nameAvailable ? "Name already taken" : "No :^)"
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User(
            req.body.name,
            hashedPassword,
            25000
        );

        await user.save();

        console.log(`[DEBUG] Registered '${name}'.`);
        res.status(201).json({ success: true });

    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
