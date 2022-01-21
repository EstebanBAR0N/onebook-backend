const { models } = require('../sequelize');
const helpers = require('../utils/helpers');

// return all tokens
exports.getTokens = async (req, res, next) => {
  try {
    // récupère tous les users
    const tokens = await models.token.findAll();

    res.status(200).json(tokens);
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
};


// return the token with the id : req.params.id
exports.getTokenById = async (req, res, next) => {
  try {
    const id = helpers.getIdParam(req);

    // récupère le file avec l'id : "id"
    const token = await models.token.findByPk(id);
    if (token) {
      res.status(200).json(token);
    } else {
      res.status(404).json({
        error: 'Token not found'
      });
    }
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
};