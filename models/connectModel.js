const mongoose = require('mongoose');

const ConnectModel = mongoose.model(
    // nom de la base de donnees
    "database",

    // nom des champs en objet
    {
        user: {
            type : String,
            required: true
        },
        pass: {
            type : String,
            required: true
        }
    },

    // nom de la collection (table)
    "connection"
);

module.exports = { ConnectModel };