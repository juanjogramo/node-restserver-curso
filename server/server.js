require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/user', function(req, res) {
    res.json('Get user');
});

app.post('/user', function(req, res) {

    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            "errorCode": 400,
            "message": "The name is required"
        });
    } else {
        res.json({ persona: body });
    }
});

app.put('/user/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/user', function(req, res) {
    res.json('Delete user');
});
let port = process.env.PORT;
app.listen(port, () => {
    console.log('Listening port: ', port);
});