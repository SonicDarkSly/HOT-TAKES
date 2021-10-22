const mongoose = require('mongoose');

// informations base de données

const databaseName = process.env.DB_NAME;
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

const User = mongoose.model(
    databaseName,
    userSchema,
    databaseCollection
);

module.exports = User;