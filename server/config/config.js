// Puerto
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Database
let isDevEnv = process.env.NODE_ENV === 'dev';
let localDB = 'mongodb://localhost:27017/cafe';
let remoteDB = process.env.MONGO_URL
process.env.URLDB = isDevEnv ? localDB : remoteDB;

// Expires Date:
// process.env.EXPIRES = 60 * 60 * 24 * 30;
process.env.EXPIRES = '48h';

// Authentication Seed
process.env.SEED = process.env.SEED || 'secretDev';

// Google Client ID
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '407051950187-17n6egetb366i1nnk65i3umuf1afjde4.apps.googleusercontent.com';