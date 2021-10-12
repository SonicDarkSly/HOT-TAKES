const mongoose = require('mongoose');

const ConnectModel = mongoose.model(
    "database",
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
    "connection"
);

module.exports = {ConnectModel};