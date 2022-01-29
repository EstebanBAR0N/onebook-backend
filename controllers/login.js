const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { models } = require('../sequelize');
const helpers = require('../utils/helpers');


// return the token or an error (wrong authentication) to the user
exports.login = async (req, res, next) => {
  try {

    // vérifie les informations utilisateur
    if (!helpers.isValidEmail(req.body.email)) {
      res.status(403).json({
        error: 'Invalid data !'
      });
      return;
    }

    // find user
    const user = await models.user.findOne({ where: { email: req.body.email } });
    if (!user) {
        return res.status(401).json({
            error: 'Wrong informations !'
        });
    }

    // valid password
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
        return res.status(401).json({
            error: 'Wrong informations !'
        });
    }

    // create new token
    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: '1d' }
    );
    
    // store new token to database
    const creationDate = new Date(Date.now());
    let expirationDate = new Date(creationDate);
    expirationDate.setDate(expirationDate.getDate() + 3)

    const newToken = new models.token({
      token: token,
      creationDate: creationDate.getTime(),
      expirationDate: expirationDate.getTime(),
      userId : user.id,
    });

    await newToken.save();

    console.log('New token save in database')

    // return userId and token
    res.status(200).json({
        userId: user.id,
        token: token,
        expirationDate: expirationDate.getTime()
    });
  } 
  catch (err) {
    res.status(500).json({
        error: 'Server error'
    });
  }
};