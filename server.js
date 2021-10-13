const express = require('express');
const app = express();
require('./models/dbConfig');
const connectRoutes = require('./routes/connectController');


// middleware

app.use(express.json());
//app.use('/', connectRoutes); // test
app.use('/', connectRoutes);

// lance le serveur sur le port 3000
app.listen(3000, () => console.log('server started on port 3000'));