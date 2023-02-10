// Controllers pour l'enregistrement et la connexion
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User');

// Permet l'enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // On hashe le mdp sur 10 tours
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // On l'enregistre
            user.save()
                .then(() => 
                    res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};

// Permet l'authentification d'un utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // On vient vérifié si l'identifiant est correct
            if (user === null) {
                return res.status(401).json({ message: "Le mot de passe et/ou l'identifiant est incorect." });
            }
            // On compare le hash du mdp avec celui créé
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: "Le mot de passe et/ou l'identifiant est incorect." });
                    }
                    // On vient générer un token lié à l'identifiant
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'TOKEN_RANDOM',
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };