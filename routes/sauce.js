// Import
// Appel de Express
const express = require('express');

// Création d'un ROUTER via EXPRESS
const router = express.Router();

// Appel du fichier auth.js pour la gestion du TOKEN (decodage, recuperation de userid)
const auth = require('../middleware/auth');

// Appel de MULTER pour la gestion de l'upload du fichier image de la sauce (nom, extention)
const multer = require('../middleware/multer-config');

// Appel du CONTROLLER "sauce"
const sauceCtlr = require('../controllers/sauce');

// Appel aux fonctions du CONTROLLER selon route
router.post('/',auth, multer, sauceCtlr.createSauce);
router.get('/', auth, sauceCtlr.getAllSauces);
router.get('/:id', auth, sauceCtlr.getOneSauce);
router.put('/:id',auth, multer, sauceCtlr.modifySauce);
router.delete('/:id', auth, sauceCtlr.deleteSauce);
router.post('/:id/like', auth, sauceCtlr.opinionSauce);

// Exportation du ROUTER
module.exports = router;