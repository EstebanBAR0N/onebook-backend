const { models } = require('../sequelize');
const { getIdParam } = require('../utils/helpers');


// return all users
exports.getUsers = async (req, res, next) => {
  try {
    // récupère tous les users
    const users = await models.user.findAll();

    res.status(200).json(users);
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
};

// return the user with the id : req.params.id
exports.getUserById = async (req, res, next) => {
  try {
    const id = getIdParam(req);

    // récupère le user avec l'id : "id"
    const user = await models.user.findByPk(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        error: 'User not found'
      });
    }
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
};