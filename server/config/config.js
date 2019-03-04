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
process.env.EXPIRES = 60 * 60 * 24 * 30;

// Authentication Seed
process.env.SEED = process.env.SEED || 'secretDev';