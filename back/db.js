/*
*   Connexion à la base de donnée MongoDB
*   Exportation de mongoose, et paramètrage des variables
*   d'environment.
*   Pour se connecter à une base de donnée, créer un fichier
*   ".env" dans la racine du back, et y mettre sa bdd
*   MongoDB avec l'authentification correspondante.
*   .env.example indique les noms des variables à utiliser.
*/

const mongoose = require('mongoose');
const dotenv = require("dotenv");
const result = dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fgnmbuj.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à la base de donée réussie.'))
  .catch(() => console.log('Connexion à la base de donnée échouée.'));

module.exports = mongoose;