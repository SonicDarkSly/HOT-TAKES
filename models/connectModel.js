const mongoose = require('mongoose');

//informations base de données
const databaseName = "database";
const databaseCollection = "connection";

const ConnectModel = mongoose.model(
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

module.exports = { ConnectModel };