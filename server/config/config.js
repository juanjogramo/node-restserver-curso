// Puerto
process.env.PORT = process.env.PORT || 3000;

// Environment

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Database

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://juanjogramo:mefpik-qefkuv-7safrI@cluster0-ds0io.mongodb.net/cafe'
}
process.env.URLDB = urlDB;