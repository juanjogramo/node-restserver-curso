const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const app = express();

const { verifyToken, verifyRole } = require('../middlewares/authentication');

app.get('/user', verifyToken, function(req, res) {


    let page = req.query.page || 0;
    page = Number(page);

    let limitPerPage = req.query.limit || 5;
    limitPerPage = Number(limitPerPage);

    let predicate = {
        state: true
    };

    User.find(predicate, 'name email role state isGoogleAccount image')
        .skip(page)
        .limit(limitPerPage)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    "errorCode": 400,
                    "message": err.message
                });
            };
            User.count(predicate, (err, count) => {
                res.json({
                    status: 'success',
                    users,
                    count
                });
            });

        });
});

app.post('/user', [verifyToken, verifyRole], function(req, res) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, newUser) => {
        if (err) {
            return res.status(400).json({
                "errorCode": 400,
                "message": err.message
            });
        }
        res.json({
            status: 'success',
            user: newUser
        })
    });
});

app.put('/user/:id', [verifyToken, verifyRole], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'email', 'image', 'role', 'state']);

    User.findByIdAndUpdate(id,
        body, { new: true, runValidators: true },
        (err, userUpdated) => {

            if (err) {
                return res.status(400).json({
                    "errorCode": 400,
                    "message": err.message
                });
            }

            res.json({
                status: 'success',
                user: userUpdated
            });

        });

});

app.delete('/user/:id', [verifyToken, verifyRole], function(req, res) {

    let id = req.params.id;
    let updateState = { state: false };

    User.findByIdAndUpdate(id, updateState, { new: true }, (err, userUpdated) => {
        if (err) {
            return res.status(400).json({
                errorCode: 400,
                message: err.message
            });
        }
        res.json({
            status: 'success',
            user: userUpdated
        });

    });

});

module.exports = app;