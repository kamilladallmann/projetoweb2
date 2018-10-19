var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

module.exports = (app) => {
    app.route('/index/cadastro')
    .get(userController.allUsers)
    .post(userController.newUser)
}