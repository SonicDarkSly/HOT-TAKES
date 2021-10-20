const mongoose = require('mongoose');

// informations base de données

const databaseCollection = process.env.DB_COLLECTION_USER;

// Schema

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true
    }
});

module.exports = mongoose.model('User', userSchema, databaseCollection)