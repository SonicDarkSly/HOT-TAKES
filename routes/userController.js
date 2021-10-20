const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel');

// SIGN UP

router.post('/signup', (req, res) => {
    User.findOne({ email: req.body.email })
    .then(userControle => {
        if (!userControle) {
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const userRegistred = new User({
                    email: req.body.email,
                    password: hash
                })
                userRegistred.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }))
            })
            .catch(error => res.status(500).json({ error }))
        }else{
            res.json({ message: 'Email ['+req.body.email+'] déja enregistré !' })
        }
    })
});

// LOGIN

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(pass => {
                    if (!pass) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            `${process.env.RND_TOKEN}`,
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
});

module.exports = router