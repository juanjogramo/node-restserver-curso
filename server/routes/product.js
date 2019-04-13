const express = require('express');
const { verifyToken, verifyRole } = require('../middlewares/authentication');
let app = express();

let Product = require('../models/product');

//Tarea
// Obtener todos los productos
// Populate: usuario y categoría
// Paginado
app.get('/product', verifyToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    Product.find({ available: true })
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            };
            res.json({
                success: true,
                products
            })
        });
});

// Obtener un producto por id
// Populate: usuario y categoría
app.get('/product/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            }
            if (!product) {
                return res.status(400).json({
                    success: false,
                    err: {
                        message: 'The id does not exist'
                    }
                });
            };
            res.json({
                success: true,
                product
            });
        });
});
// Buscar productos
app.get('/products/search/:query', verifyToken, (req, res) => {

    let query = req.params.query;
    let regex = new RegExp(query, 'i');

    Product.find({ name: regex })
        .populate('category', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    err
                });
            };

            res.json({
                success: true,
                products
            });
        });
});

// Crear un nuevo producto
// grabar el usuario
// grabar la categoria del listado

app.post('/product', verifyToken, (req, res) => {
    let body = req.body;

    let product = new Product({
        name: body.name,
        price: body.price,
        decription: body.decription,
        available: true,
        category: body.category,
        user: req.user._id
    });

    product.save((err, newProduct) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        };

        res.status(201).json({
            success: true,
            product: newProduct
        });
    });
});

// Actualizar un producto por id
app.put('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let newValues = {
        name: body.name,
        price: body.price,
        decription: body.decription,
        available: body.available,
        category: body.category
    };

    Product.findByIdAndUpdate(id, newValues, { new: true, runValidators: true }, (err, productUpdated) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        };
        if (!productUpdated) {
            return res.status(400).json({
                success: false,
                err
            });
        };
        res.json({
            success: true,
            productUpdated
        });
    });
});

// Borrar un producto por id
// Cambiar la propiedad available
app.delete('/product/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    let updateState = { available: false };

    Product.findByIdAndUpdate(id, updateState, { new: true }, (err, productUpdated) => {
        if (err) {
            return res.status(500).json({
                success: false,
                err
            });
        };
        if (!productUpdated) {
            return res.status(400).json({
                success: false,
                err: {
                    message: 'The id does not exist'
                }
            });
        };

        res.json({
            success: true,
            productUpdated,
            message: 'Product state updated'
        })
    });
});

module.exports = app;