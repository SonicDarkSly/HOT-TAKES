const express = require('express');
const router = express.Router();

const { ConnectModel } = require('../models/connectModel');


router.get('/', (req, res) => {

    // cherche dans la base de donnees
    ConnectModel.find((err, docs) => {

        // affiche la reponse de la db a l'écran
        if (!err) res.send(docs);

        // si erreur, affiche erreur dans console
        else console.log('error to get data : '+ err);
    })
});


router.post('/', (req, res) => {
    const newRecord = new ConnectModel({
            email: req.body.email,
            password: req.body.password
    });
    
    newRecord.save((err, docs) => {
        if (!err) res.send(docs);
        else console.log('error creating new data : '+ err);
    });
});


module.exports = router