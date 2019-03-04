const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, user) => {
        if (err) {
            return res.status(500).json({
                errorCode: 500,
                message: err.message
            })
        }

        if (!user) {
            return res.status(400).json({
                errorCode: 400,
                message: 'User or password incorrect'
            })
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({
                errorCode: 400,
                message: 'Password incorrect'
            })
        }
        let token = jwt.sign({
            user
        }, process.env.SEED, { expiresIn: process.env.EXPIRES });
        res.json({
            status: 'success',
            user,
            token
        });
    });
});

module.exports = app;