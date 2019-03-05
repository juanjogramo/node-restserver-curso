const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        isGoogleAccount: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(err => {
            res.status(403).json({
                isSuccess: false,
                error: err
            })
        })

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                errorCode: 500,
                message: err.message
            })
        };

        if (userDB) {
            if (!userDB.isGoogleAccount) {
                return res.status(400).json({
                    errorCode: 400,
                    message: 'The user should use normal autentication'
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRES });

                return res.json({
                    isSuccess: true,
                    user: userDB,
                    token
                });
            }
        } else {
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.image = googleUser.image;
            user.isGoogleAccount = true;
            user.password = ':)';

            user.save((err, newUser) => {
                if (err) {
                    return res.status(500).json({
                        errorCode: 500,
                        message: err.message
                    })
                };

                let token = jwt.sign({
                    user: newUser
                }, process.env.SEED, { expiresIn: process.env.EXPIRES });

                return res.json({
                    isSuccess: true,
                    user: newUser,
                    token
                });
            });
        };
    });
});

module.exports = app;