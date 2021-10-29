// Impor
// Appel de file system pour la gestion de l'image (modification sauce et suppression sauce)
 const fs = require('fs');

// Appel du MODEL
 const Sauce = require('../models/sauceModel');
 

// ---------- CREATION SAUCE ----------

  exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    // Suppression de l'id recu du frontend
    delete sauceObject._id;

    // Création d'une instance du model
    const sauce = new Sauce({
        ...sauceObject,

        // Création de l'URL de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

        // initialise les likes/dislikes
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    // Sauvegarde dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => {
            console.log(json({ error }));
            res.status(400).json({ error });
        });
};
 

// ---------- VISUALISATION TOUTES LES SAUCES ----------

 exports.getAllSauces = (req, res, next) => {

     // Recherche toute les sauces dans la base de données
     Sauce.find()
         .then(sauces => res.status(200).json(sauces))
         .catch(error => res.status(400).json({ error }));
 }
 

// ---------- VISUALISATION UNE SAUCE ----------

 exports.getOneSauce = (req, res, next) => {

    // Recherche la sauce sélectionné par l'utilisateur dans la base de données selon l'_id de la sauce 
     Sauce.findOne({
             _id: req.params.id
         })
         .then(sauce => res.status(200).json(sauce))
         .catch(error => res.status(404).json({ error }));
 }
 

// ---------- MODIFICATION D'UNE SAUCE ----------

  exports.modifySauce = (req, res, next) => {
    if (req.file) {

        // Recherche la sauce dans la base de données selon l'_id de la sauce 
        Sauce.findOne({ 
            _id: req.params.id 
        })
        .then(sauce => {

                // si l'image est modifiée, supprime l'ancienne image dans le dossier /images
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {

                    // une fois l'ancienne image supprimée, mise à jour
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }

                    // sauvegarde la mise à jour
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

    // Recherche la sauce dans la base de données selon l'_id de la sauce 
     Sauce.findOne({ _id: req.params.id })
         .then(sauce => {

             // Recherche le fichier de l'image
             const filename = sauce.imageUrl.split('/images/')[1];

             // utilisation de file system pour supprimer l'image dans le dossier /images
             fs.unlink(`images/${filename}`, () => {

                 // Suppression de la Sauce dans la base de données
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
         
         // Si l'utilisateur supprime son opinion
         case 0: 

             // Recherche la sauce dans la base de données selon l'_id de la sauce 
             Sauce.findOne({ _id: req.params.id })
                 .then((sauce) => {

                     // Si l'utilisateur avait liké la Sauce
                     if (sauce.usersLiked.find(user => user === req.body.userId)) {
                         Sauce.updateOne({ _id: req.params.id }, {

                                 // utilisations des variables $inc et $pull de mongodb pour mettre à jour
                                 // Décrémenter de 1 les likes
                                 $inc: { likes: -1 }, 

                                 // Retirer l'ID de l'utilisateur du tableau des liked
                                 $pull: { usersLiked: req.body.userId }, 
                                 _id: req.params.id
                             })
                             .then(() => res.status(201).json({ message: 'Ton avis a été pris en compte!' }))
                             .catch(error => res.status(400).json({ error }));
                     }

                     // Si l'utilisateur avait disliké la Sauce
                     if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                         Sauce.updateOne({ _id: req.params.id }, {

                                 // utilisations des variables $inc et $pull de mongodb pour mettre à jour
                                 // Décrémenter de 1 les dislikes
                                 $inc: { dislikes: -1 }, 

                                 // Retirer l'ID de l'utilisateur du tableau des disliked
                                 $pull: { usersDisliked: req.body.userId }, 
                                 _id: req.params.id
                             })
                             .then(() => res.status(201).json({ message: 'Ton avis a été pris en compte!' }))
                             .catch(error => res.status(400).json({ error }));
                     }
                 })
                 .catch(error => res.status(404).json({ error }));
             break;

         // Si l'utilisateur like la Sauce
         case 1: 

             // met à jour la sauce dans la base de données selon l'_id de la sauce 
             Sauce.updateOne({ _id: req.params.id }, {

                     // utilisations des variables $inc et $push de mongodb pour mettre à jour
                     // Incrémenter de 1 les likes
                     $inc: { likes: 1 }, 

                     // Ajouter l'ID de l'utilisateur au tableau des liked
                     $push: { usersLiked: req.body.userId }, 
                     _id: req.params.id
                 })
                 .then(() => res.status(201).json({ message: 'Ton like a été pris en compte !' }))
                 .catch((error) => res.status(400).json({ error }));
             break;

         // Si l'utilisateur dislike la Sauce
         case -1: 

             // met à jour la sauce dans la base de données selon l'_id de la sauce 
             Sauce.updateOne({ _id: req.params.id }, {
                
                     // utilisations des variables $inc et $push de mongodb pour mettre à jour
                     // Incrémenter de 1 les disliked
                     $inc: { dislikes: 1 }, 

                     // Ajouter l'ID de l'utilisateur au tableau des disliked
                     $push: { usersDisliked: req.body.userId }, 
                     _id: req.params.id
                 })
                 .then(() => res.status(201).json({ message: 'Ton dislike a été pris en compte !' }))
                 .catch((error) => res.status(400).json({ error }));
             break;

         // Si la valeur attendu n'est pas correcte
         default: 
         console.error('Cette valeur n\'est pas valide !');
     }
 
 }