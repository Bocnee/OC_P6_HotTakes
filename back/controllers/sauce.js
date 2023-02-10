// Controllers pour les sauces
// Schéma des sauces, et fs permet la modification des fichiers
const Sauce = require('../models/Sauce');
const fs = require('fs');


// Permet d'afficher toutes les sauces sur la page
exports.allSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Permet de trouver une sauce, et donc de l'afficher sur une page à part lors du clic
exports.oneSauce = (req, res, next) => {
    Sauce.findOne(
        {  _id: req.params.id }
    )
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};


// Permet de créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    // on met le nombre de like / disklike à 0, et prépare les tableaux des utilisateurs ayant liké / disliké la sauce
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0, 
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "La sauce a bien été enregegistrée."}))
        .catch(error => res.status(400).json({ error }));
};

// Permet de modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne(
        { _id: req.params.id }
    )
    .then((sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(400).json({ message: "Non-autorisé." });
        } else {
            Sauce.updateOne(
                { _id: req.params.id }, 
                { ...sauceObject, _id: req.params.id }
            )
            .then(() => res.status(200).json({ message: "La sauce a été modifiée." }))
            .catch(error => res.status(401).json({ error }));
        }
    }))
    .catch(error => res.status(400).json({ error }));
};

// Permet de supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne(
        { _id: req.params.id }
    )
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: "Non-autorisé." });
        } else {
            // on va également supprimer l'image du répertoire images
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne(
                    { _id: req.params.id }
                )
                .then(() => { res.status(200).json({ message: "La sauce a été supprimée" })})
                .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch(error => res.status(500).json({ error }));
};

// Permet de gérer les likes
exports.likesSauce = (req, res, next) => {
    // Si l'utilisateur a aimé
    if (req.body.like === 1) {
        Sauce.updateOne(
            // on récupère l'id de la sauce
            { _id: req.params.id },
            // on push l'id utilisateur dans le tableau usersLiked
            { 
                $push: { usersLiked: req.body.userId },
                 // on ajoute un like au compteur
                $inc: { likes: +1 }
            }
        )
        .then(() => res.status(200).json({ message: "Like ajouté." }))
        .catch(error => res.satus(400).json({ error }));
    }
    // Si l'utilisateur retire son like
    if (req.body.like === 0) {
        Sauce.findOne(
            { _id: req.params.id }
        )
        .then(sauce => {
            // on cherhce si l'utilisateur est dans le tableau usersLiked
            if (sauce.usersLiked.includes(req.body.userId)) {
                Sauce.updateOne(
                    // si oui, on le retire du tableau, et on retire son like
                    { _id: req.params.id },
                    { 
                        $pull: { usersLiked: req.body.userId },
                        $inc: { likes: -1 }
                    }
                )
                .then(() => res.status(200).json({ message: "Like retiré." }))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
    }
    next();
};

// Permet de gérer les dislikes
exports.dislikesSauce = (req, res, next) => {
    // Si l'utilisateur n'a pas aimé
    if (req.body.like === -1) {
        Sauce.updateOne(
            // on récupère l'id de la sauce
            { _id: req.params.id },
            // on push l'id utilisateur dans le tableau usersDisliked
            { 
                $push: { usersDisliked: req.body.userId },
                 // on ajoute un dislike
                $inc: { dislikes: +1 }
            }
        )
        .then(() => res.status(200).json({ message: "Dislike ajouté." }))
        .catch(error => res.satus(400).json({ error }));
    }
    // Si l'utilisateur retire son dislike
    if (req.body.like === 0) {
        Sauce.findOne(
            { _id: req.params.id }
        )
        .then(sauce => {
            // on cherhce si l'utilisateur est dans le tableau usersDisliked
            if (sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne(
                    // si oui, on le retire du tableau, et on retire son dislike
                    { _id: req.params.id },
                    { 
                        $pull: { usersDisliked: req.body.userId },
                        $inc: { dislikes: -1 }
                    }
                )
                .then(() => res.status(200).json({ message: "Dislike retiré." }))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));
    }
};