// Import

require('dotenv').config({ path: process.cwd() + '/.env' });
const express = require ('express')
require('./models/dbConfig');
const userRoutes = require('./routes/userController')
const sauceRoutes = require('./routes/sauceController')

const app = express()

// Headers

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use(express.json())

app.use('/api/auth/', userRoutes)
//app.use('/api/sauces/', sauceRoutes);

module.exports = app
