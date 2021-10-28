// Import de mongoose
const mongoose = require('mongoose');

// Collection dans la quelle sera enregistré les éléments
const databaseCollection = process.env.DB_COLLECTION_USER;

// Appel de mongoose-unique-validator pour le controle
const mongooseValidator = require('mongoose-unique-validator')

// Schema
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email requis !'],
        unique: true
    },
    password: { 
        type: String, 
        required: [true, 'Mot de passe requis !'] 
    }
});

userSchema.plugin(mongooseValidator);

// Exportation du schema en model (nom du model, schema, collection)
module.exports = mongoose.model("user", userSchema, databaseCollection);