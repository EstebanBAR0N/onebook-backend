const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { models } = require('../sequelize');


// return the token or an error (wrong authentication) to the user
exports.login = async (req, res, next) => {
  try {

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
      { expiresIn: '1h' }
    );
    
    // store new token to database
    const creationDate = new Date(Date.now());
    let expirationDate = new Date(
      new Date(creationDate).setHours(creationDate.getHours() + 1)
    );

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
        token: token
    });
  } 
  catch (err) {
    res.status(500).json({
        error: 'Server error'
    });
  }
};