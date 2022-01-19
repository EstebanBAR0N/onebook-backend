const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { models } = require('../sequelize');


// return the token or an error (wrong authentication) to the user
exports.login = (req, res, next) => {
  
};