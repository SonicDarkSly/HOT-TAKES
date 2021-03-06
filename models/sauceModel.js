// Import de mongoose
const mongoose = require('mongoose');

// Collection dans la quelle sera enregistré les éléments
const databaseCollection = process.env.DB_COLLECTION_SAUCE;

// Schema
const sauceSchema = mongoose.Schema({
    userId: { 
        type: String, required: true 
    },
    name: { 
        type: String, 
        required: [true, 'Le nom de la sauce est requis !'] 
    },
    manufacturer: {
        type: String, 
        required: [true, 'Le fabricant de la sauce est requis !'] 
    },
    description: { 
        type: String, 
        required: [true, 'La description de la sauce est requise !'] 
    },
    mainPepper: { 
        type: String, 
        required: [true, 'Le principal ingrédient de la sauce est requis !'] 
    },
    imageUrl: { 
        type: String, 
        required: [true, 'L\'image de la sauce est requise !'] 
    },
    heat: { 
        type: Number, 
        required: [true, 'La puissance de la sauce est requise !'] 
    },
    likes: { 
        type: Number, 
        required: false, 
        default: 0 
    },
    dislikes: { 
        type: Number, 
        required: false,
        default: 0 
    },
    usersLiked: { 
        type: [String], 
        required: false 
    },
    usersDisliked: { 
        type: [String], 
        required: false 
    }
});

// Exportation du schema en model (nom du model, schema, collection)
module.exports = mongoose.model("sauce", sauceSchema, databaseCollection);