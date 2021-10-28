// Import
// Appel de bcrypt pour le hashage du mot de passe
const bcrypt = require('bcrypt')

// Appel de jsonwebtoken pour la gestion du TOKEN (creation)
const jwt = require('jsonwebtoken')

// Appel du MODEL
const User = require('../models/userModel');


// ---------- SIGN UP ----------

// Pour l'enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) => {


    // Controle renforcée du mot de passe

   /* const crtlPass = req.body.password;
    if (crtlPass.match( /[0-9]/g) && 
        crtlPass.match( /[A-Z]/g) && 
        crtlPass.match(/[a-z]/g) && 
        crtlPass.match( /[^a-zA-Z\d]/g) &&
        crtlPass.length >= 10) {

        
    }
    */

            // hashage du mdp
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const userRegistred = new User({
                    email: req.body.email,
                    password: hash
                })

                // enregistrement dans base de données
                userRegistred.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                    .catch(error => 
                        res.status(403).json({ 
                            message: 'Adresse mail deja existante dans la base de données\n\n'+ error
                        })
                    )
            })
            .catch(error => res.status(500).json({ error }))
};


// ---------- LOGIN ----------

// Pour la connection de l'utilisateur
exports.login = (req, res, next) => {

    // recherche le champs email dans la requete
    User.findOne({ email: req.body.email })
        .then(user => {

            // Controle si l'utilisateur existe ou pas
            // si utilisateur existe pas
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            // si utilisateur existe
            // comparaison du mot de passe réel avec celui hashé dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(pass => {

                    // si mot de passe incorrect
                    if (!pass) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !'})
                    }

                    // si mot de passe correct
                    // creation TOKEN, userid + token, durée 24h
                    const newToken = jwt.sign(
                        { userId: user._id }, 
                        `${process.env.RND_TOKEN}`, 
                        { expiresIn: '24h' }
                    )

                    res.setHeader('Authorization', 'Bearer '+ newToken);
                    
                    res.status(200).json({
                        userId: user._id,
                        token: newToken
                    })
                    
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};
