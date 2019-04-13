const express = require('express');

let { verifyToken, verifyRole } = require('../middlewares/authentication');

let app = express();
let Category = require('../models/category');

// Display all the categories
app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            };
            res.json({
                success: true,
                categories
            })
        });
});
// Display category by id
app.get('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    Category.findById(id, (err, category) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        };
        if (!category) {
            return res.status(400).json({
                success: true,
                err: {
                    message: 'The id is not corret'
                }
            });
        };

        res.json({
            success: true,
            category
        })
    });
});
// Create a new category
app.post('/category', verifyToken, (req, res) => {

    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        };
        if (!categoryDB) {
            return res.status(400).json({
                success: false,
                err
            });
        };

        res.json({
            success: true,
            category: categoryDB
        });
    });
});
// Update a category by id
app.put('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let newValues = {
        description: body.description
    };

    Category.findByIdAndUpdate(id,
        newValues, { new: true, runValidators: true },
        (err, categoryUpdated) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            };
            if (!categoryUpdated) {
                return res.status(400).json({
                    success: false,
                    err
                });
            };

            res.json({
                success: true,
                categoryUpdated
            });
        });
});

// Delete a category by id
app.delete('/category/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDeleted) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        };
        if (!categoryDeleted) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'The id does not exist'
                }
            });
        };

        res.json({
            success: true,
            message: 'Category deleted'
        })
    });
});

module.exports = app;