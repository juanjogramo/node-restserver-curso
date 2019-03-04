require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser')

let port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    //Setup global routes
app.use(require('./routes/index.js'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) throw err;
    console.log('Data base ONLINE');
});

app.listen(port, () => {
    console.log('Listening port: ', port);
});