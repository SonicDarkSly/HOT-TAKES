const express = require('express');
const app = express();
require('./models/dbConfig');
const connectRoutes = require('./routes/connectController')

// middleware

app.use('/', connectRoutes);

// lance le serveur sur le port 5500
app.listen(5500, () => console.log('server started on port 5500'));