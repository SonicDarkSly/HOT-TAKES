// Import de mongoose
const mongoose = require('mongoose');

// Paramètres de la base de données
// Utilisations de variables d'environnement pour la sécurité
const uri = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@"+process.env.DB_CLUSTER+"/"+process.env.DB_NAME+"?retryWrites=true&w=majority";
const client = { useNewUrlParser: true, useUnifiedTopology: true };

// Connection à la base de données avec retour console
mongoose.connect(
  uri,
  client,
)
  .then(() => console.log('MongoDB connected success'))
  .catch((err) => console.log('MongoDB error : '+ err));
