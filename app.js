// Import

require('dotenv').config({ path: process.cwd() + '/.env' });
const express = require ('express')
require('./models/dbConfig');
const path = require('path');
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

const app = express()

// Headers

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth/', userRoutes)
app.use('/api/sauces/', sauceRoutes);

module.exports = app
