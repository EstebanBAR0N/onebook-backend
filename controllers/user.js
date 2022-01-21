const { Op } = require("sequelize");
const { models } = require('../sequelize');
const helpers = require('../utils/helpers');


// return all users
exports.getUsers = async (req, res, next) => {
  try {

    // récupère les paramètre de la requête
    const params = helpers.getUserParams(req);

    // vérifie les paramètres passé par l'utilisateur
    if (helpers.corruptedArg(params)) {
      res.status(403).json({
        error: 'Invalid data passed in the url'
      });

      return;
    }

    // génère la query en fonction des paramètres
    let query = {};
    
    if (params['username']) {
      const usernameQuery = {
        where: {
          username: {
            [Op.iLike]: '%' + params['username'] + '%'
          }
        }
      }
      query = {...query, ...usernameQuery};
    }
    if (params['offset']) {
      query = {...query, ...{offset: params['offset']}};
    }
    if (params['limit']) {
      query = {...query, ...{limit: params['limit']}};
    }

    // récupère tous les users
    const users = await models.user.findAll(query);

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
    const id = helpers.getIdParam(req);

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