const bcrypt = require('bcrypt');
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


// modify a user
exports.updateUser = async (req, res, next) => {
  try {
    const id = helpers.getIdParam(req);

    // récupère le user avec l'id : "id"
    const userToModify = await models.user.findByPk(id);

    // si le user n'existe pas
    if (!userToModify) {
      return res.status(404).json({
        error: 'User not found!'
      });
    }

    // si ce n'est pas son compte ou que le user n'est pas admin, pas le droit de modifier
    const userWhoUpdate = await models.user.findByPk(req.auth.userId);
    if (!userWhoUpdate) {
      return res.status(404).json({
        error: 'We can\'t find your id!'
      });
    }

    if (userToModify.id !== req.auth.userId && !userWhoUpdate.admin) {
      return res.status(403).json({
        error: 'Unauthorized request!'
      });
    }
    
    // check user info
    if (
      (req.body.username && !helpers.isValidString(req.body.username)) || 
      (req.body.email && !helpers.isValidEmail(req.body.email))
    ) {
      res.status(406).json({
        error: 'Invalid data, request not acceptable!'
      });
      return;
    }
    
    // modification du user
    // soit pseudo, mail, date de naissance
    // soit mot de passe
    // soit l'image de profil
    let dataToModify = {};
    if (req.body.username && req.body.email && req.body.birthDate) {
      // check if not exist a user with same info
      const userAlreadyExist = await models.user.findOne({ 
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { username: req.body.username },
                { email: req.body.email }
              ]
            },
            { 
              id: {
              [Op.ne]: userToModify.id
              }
            }
          ]
        } 
      });

      if (userAlreadyExist) {
        return res.status(409).json({
          error: 'A user already has these data!'
        });
      }

      const birthDate = Date.parse(req.body.birthDate);

      dataToModify = {
        username : req.body.username,
        email: req.body.email,
        birthDate: birthDate
      };
    }
    else if (req.body.password) {
      hashPassword = await bcrypt.hash(req.body.password, 10);

      dataToModify = {  
        password: hashPassword
      };
    }
    else if (req.body.profilImage) {
      dataToModify = {
        profilImage : req.body.profilImage
      };
    }
    else {
      return res.status(400).json({
        error: 'Bad request !'
      });
    }
    
    await models.user.update(dataToModify, { where : { id : id } });
    
    res.status(200).json({
      message: 'User updated successfully!'
    });
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
}


// delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    const id = helpers.getIdParam(req);

    // récupère le user avec l'id : "id"
    const user = await models.user.findByPk(id);

    // si le user n'existe pas
    if (!user) {
      return res.status(404).json({
        error: 'User not found!'
      });
    }

    // si ce n'est pas son compte ou que le user n'est pas admin, pas le droit de supprimer
    const userWhoDelete = await models.user.findByPk(req.auth.userId);
    if (!userWhoDelete) {
      return res.status(404).json({
        error: 'We can\'t find your id!'
      });
    }

    if (user.id !== req.auth.userId && !userWhoDelete.admin) {
      return res.status(403).json({
        error: 'Unauthorized request!'
      });
    }
    
    // delete user
    await user.destroy();
    
    res.status(200).json({
      message: 'User deleted successfully!'
    });
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
}