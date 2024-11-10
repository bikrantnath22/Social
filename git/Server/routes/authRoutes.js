const express = require('express');
const Router = express.Router();
const { Auth,Token,Login } = require('../controllers/authController');




Router.post("/register", Auth);



Router.get('/api/verify/:token', Token);


Router.post('/login', Login)


module.exports = Router;