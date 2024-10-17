var express = require('express');
var router = express.Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const hashService = require('../services/hashService')();

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        const hashedPassword = await hashService.hashPassword(password);

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Incorrect email or password');
        }

        const passwordMatches = await hashService.comparePasswords(password, user.password);

        if (!passwordMatches) {
            throw new Error('Incorrect email or password');
        }

        const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: "24h" });

        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                throw new Error('Token is invalid');
            } else {
                res.json({ 'token': token, 'expires': decoded.exp });
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
