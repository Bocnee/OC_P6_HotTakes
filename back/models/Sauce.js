/* On vient créer le schéma des sauces
* userId: string, l'identifiant MongoDB
* name: string, nom de la sauce
* manufacturer: string, fabricant de la sauce
* description: string, la description de la sauce
* mainPepper: string, l'ingrédient principal de la sauce
* imageUrl: string, l'image de la sauce
* heat: number, décrit la sauce
* likes: number
* dislikes: number
* usersDislikes: tableau des utilisateurs
* usersLikes: tableau des utilisateurs
*/
const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true},
    manufacturer: {type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true},
    dislikes: { type: Number, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);