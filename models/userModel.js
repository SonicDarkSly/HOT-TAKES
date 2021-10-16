const mongoose = require('mongoose');

//informations base de données
const databaseName = process.env.DB_NAME;
const databaseCollection = process.env.DB_COLLECTION;

const userModel = mongoose.model(
    // nom de la base de donnees
    databaseName,

    // nom des champs en objet
    {
        email: {
            type : String,
            required: true
        },
        password: {
            type : String,
            required: true
        }
    },

    // nom de la collection (table)
    databaseCollection
);

module.exports = { userModel };