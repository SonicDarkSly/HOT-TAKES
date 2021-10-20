const express = require('express');
const router = express.Router();

const Sauce = require('../models/sauceModel')

// Créer une sauce

router.post('/', (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        sauceObject,
        
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }))
});