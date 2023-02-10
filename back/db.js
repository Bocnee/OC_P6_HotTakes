const mongoose = require('mongoose');
const dotenv = require("dotenv");
const result = dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fgnmbuj.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à la base de donée réussie.'))
  .catch(() => console.log('Connexion à la base de donnée échouée.'));

  module.exports = mongoose;