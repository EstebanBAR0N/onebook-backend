const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const { models } = require('../sequelize');
const helpers = require('../utils/helpers');


// create a new user in database
exports.signup = async (req, res, next) => {
  try {
    // vérifie les informations utilisateur
    if (
      !helpers.isValidString(req.body.username) || 
      !helpers.isValidEmail(req.body.email) || 
      req.body.admin === true
    ) {
      res.status(406).json({
        error: 'Invalid data, request not acceptable!'
      });
      return;
    }

    // hash password
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    // calculate timestamp (sequelize DATE => INTEGER)
    // req.body.birthDate : year-month-day
    const birthDate = Date.parse(req.body.birthDate);

    // create new user
    const user = new models.user({
        username : req.body.username,
        email: req.body.email,
        password: hashPassword,
        profilImage : (req.body.profilImage || null),
        birthDate: (birthDate || null),
        admin : false
    });

    // check if user already exists (same info)
    const userAlreadyExist = await models.user.findOne({ 
      where: {
        [Op.or]: [
          { username: user.username },
          { email: user.email }
        ]
      } 
    });

    if (userAlreadyExist) {
        return res.status(409).json({
            error: 'User already exists!'
        });
    }

    // save new user to database
    await user.save();

    res.status(201).json({
        message: 'User added successfully!'
    });
  }
  catch (err) {
    res.status(500).json({
        error: 'Server Error'
    })
  }
};