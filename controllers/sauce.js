// Import
// Appel de file system pour la gestion de l'image (modification sauce et suppression sauce)
 const fs = require('fs');

// Appel du MODEL
 const Sauce = require('../models/sauceModel');
 

// ---------- CREATION SAUCE ----------

// Fonction pour la creation d'un sauce
  exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => {
            console.log(json({ error }));
            res.status(400).json({ error });
        });
};
 

// ---------- VISUALISATION TOUTES LES SAUCES ----------

 exports.getAllSauces = (req, res, next) => {
     Sauce.find()
         .then(sauces => res.status(200).json(sauces))
         .catch(error => res.status(400).json({ error }));
 }
 

// ---------- VISUALISATION UNE SAUCE ----------

 exports.getOneSauce = (req, res, next) => {
     Sauce.findOne({
             _id: req.params.id
         })
         .then(sauce => res.status(200).json(sauce))
         .catch(error => res.status(404).json({ error }));
 }
 

// ---------- MODIFICATION D'UNE SAUCE ----------

  exports.modifySauce = (req, res, next) => {
    if (req.file) {
        // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /image
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        // si l'image n'est pas modifiée
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
            .catch(error => res.status(400).json({ error }));
    }
};
 

// ---------- SUPPRESSION D'UNE SAUCE ----------

 exports.deleteSauce = (req, res, next) => {
     Sauce.findOne({ _id: req.params.id })
         .then(sauce => {
             const filename = sauce.imageUrl.split('/images/')[1];
             fs.unlink(`images/${filename}`, () => {
                 // Supprimer la Sauce
                 Sauce.deleteOne({ _id: req.params.id })
                     .then(() => res.status(200).json({ message: 'La sauce a bien été suprimmée !' }))
                     .catch(error => res.status(400).json({ error }));
             });
         })
         .catch(error => res.status(500).json({ error }));
 }
 
 
 // ---------- LIKE, DISLIKE OU PAS D'OPINION D'UNE SAUCE ----------

 exports.opinionSauce = (req, res, next) => {
     switch (req.body.like) {
         case 0: // Si l'utilisateur supprime son opinion
             Sauce.findOne({ _id: req.params.id })
                 .then((sauce) => {
                     // Si l'utilisateur avait liké la Sauce
                     if (sauce.usersLiked.find(user => user === req.body.userId)) {
                         Sauce.updateOne({ _id: req.params.id }, {
                                 $inc: { likes: -1 }, // Décrémenter de 1 les likes
                                 $pull: { usersLiked: req.body.userId }, // Retirer l'ID de l'utilisateur du tableau des liked
                                 _id: req.params.id
                             })
                             .then(() => res.status(201).json({ message: 'Ton avis a été pris en compte!' }))
                             .catch(error => res.status(400).json({ error }));
                     }
                     // Si l'utilisateur avait disliké la Sauce
                     if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                         Sauce.updateOne({ _id: req.params.id }, {
                                 $inc: { dislikes: -1 }, // Décrémenter de 1 les dislikes
                                 $pull: { usersDisliked: req.body.userId }, // Retirer l'ID de l'utilisateur du tableau des disliked
                                 _id: req.params.id
                             })
                             .then(() => res.status(201).json({ message: 'Ton avis a été pris en compte!' }))
                             .catch(error => res.status(400).json({ error }));
                     }
                 })
                 .catch(error => res.status(404).json({ error }));
             break;
         case 1: // Si l'utilisateur like la Sauce
             Sauce.updateOne({ _id: req.params.id }, {
                     $inc: { likes: 1 }, // Incrémenter de 1 les likes
                     $push: { usersLiked: req.body.userId }, // Ajouter l'ID de l'utilisateur au tableau des liked
                     _id: req.params.id
                 })
                 .then(() => res.status(201).json({ message: 'Ton like a été pris en compte !' }))
                 .catch((error) => res.status(400).json({ error }));
             break;
         case -1: // Si l'utilisateur dislike la Sauce
             Sauce.updateOne({ _id: req.params.id }, {
                     $inc: { dislikes: 1 }, // Incrémenter de 1 les disliked
                     $push: { usersDisliked: req.body.userId }, // Ajouter l'ID de l'utilisateur au tableau des disliked
                     _id: req.params.id
                 })
                 .then(() => res.status(201).json({ message: 'Ton dislike a été pris en compte !' }))
                 .catch((error) => res.status(400).json({ error }));
             break;
         default: // Si la valeur attendu n'est pas correcte
             console.error('Cette valeur n\'est pas valide !');
     }
 
 }