// Import de mongoose
const mongoose = require('mongoose');

// Collection dans la quelle sera enregistré les éléments
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

// Exportation du schema en model (nom du model, schema, collection)
module.exports = mongoose.model("user", userSchema, databaseCollection);