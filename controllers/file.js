const { param } = require("express/lib/request");
const { Op } = require("sequelize");
const { models } = require('../sequelize');
const helpers = require('../utils/helpers');


// return all files
exports.getFiles = async (req, res, next) => {
  try {
    // récupère les paramètre de la requête
    const params = helpers.getFileParams(req);

    // // vérifie les paramètres passé par l'utilisateur
    if (helpers.corruptedArg(params)) {
      res.status(403).json({
        error: 'Invalid data passed in the url'
      });

      return;
    }

    // génère la query en fonction des paramètres
    let query = {};
    let whereQuery = {};
    
    // userId et format
    if (params['userId'] && params['format']) {
      whereQuery = { 
        where: {
          [Op.and]: {
            userId : params['userId'],
            format : params['format'],
          }
        }
      }
    }
    else if (params['userId']) {
      whereQuery = { 
        where: {
          userId : params['userId'],         
        }
      }
    }
    else if (params['format']) {
      whereQuery = { 
        where: {
          format : params['format'],         
        }
      }
    }

    if (whereQuery) {
      query = {...query, ...whereQuery};
    } 
    
    // offset et limit
    if (params['offset']) {
      query = {...query, ...{offset: params['offset']}};
    }
    if (params['limit']) {
      query = {...query, ...{limit: params['limit']}};
    }

    // récupère tous les users
    const files = await models.file.findAll(query);

    res.status(200).json(files);
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
};


// create a new file
exports.createFile = async (req, res, next) => {
  try {
    // vérifie les informations utilisateur
    // check si userId existe
    if (!isNaN(req.body.userId)) {
      const userExist = await models.user.findOne({ 
        where: {
          id : req.body.userId
        } 
      });
  
      if (!userExist) {
        return res.status(404).json({
            error: 'User doesn\'t exists!'
        });
      }
    }

    // check si les données sont valides
    if (
      !helpers.isValidFormat(req.body.format) ||
      !helpers.isValidUrl(req.body.url) ||
      isNaN(req.body.userId)
    ) {
      res.status(403).json({
        error: 'Invalid data'
      });
      return;
    }

    // create new file
    const file = new models.file({
        url : req.body.url,
        format: req.body.format,
        onHold: false,
        userId: req.body.userId
    });

    // save new file to database
    await file.save();

    res.status(201).json({
        message: 'File added successfully!'
    });
  }
  catch (err) {
    res.status(500).json({
        error: 'Server Error'
    })
  }
};


// return the file with the id : req.params.id
exports.getFileById =  async (req, res, next) => {
  try {
    const id = helpers.getIdParam(req);

    // récupère le file avec l'id : "id"
    const file = await models.file.findByPk(id);
    if (file) {
      res.status(200).json(file);
    } else {
      res.status(404).json({
        error: 'File not found'
      });
    }
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
};


// modify a file
exports.updateFile = async (req, res, next) => {
  try {
    const id = helpers.getIdParam(req);

    // récupère le file avec l'id : "id"
    const fileToModify = await models.file.findByPk(id);

    // si le file n'existe pas
    if (!fileToModify) {
      return res.status(404).json({
        error: 'File not found!'
      });
    }

    // si ce n'est pas son compte ou que le user n'est pas admin, pas le droit de modifier
    const userWhoUpdate = await models.user.findByPk(req.auth.userId);
    if (!userWhoUpdate) {
      return res.status(404).json({
        error: 'We can\'t find your user id!'
      });
    }

    if (fileToModify.userId !== req.auth.userId && !userWhoUpdate.admin) {
      return res.status(403).json({
        error: 'Unauthorized request!'
      });
    }
    
    // check user info
    if (
      !helpers.isValidUrl(req.body.url)
    ) {
      res.status(406).json({
        error: 'Invalid data, request not acceptable!'
      });
      return;
    }
    
    // modification du fichier
    const dataToModify = { url : req.body.url };
    
    await models.file.update(dataToModify, { where : { id : id } });
    
    res.status(200).json({
      message: 'File updated successfully!'
    });
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
}


// delete a file
exports.deleteFile = async (req, res, next) => {
  try {
    const id = helpers.getIdParam(req);

    // récupère le file avec l'id : "id"
    const file = await models.file.findByPk(id);

    // si le file n'existe pas
    if (!file) {
      return res.status(404).json({
        error: 'File not found!'
      });
    }

    // si ce n'est pas son compte ou que le user n'est pas admin, pas le droit de supprimer
    const userWhoDelete = await models.user.findByPk(req.auth.userId);
    if (!userWhoDelete) {
      return res.status(404).json({
        error: 'We can\'t find your id!'
      });
    }

    if (file.userId !== req.auth.userId && !userWhoDelete.admin) {
      return res.status(403).json({
        error: 'Unauthorized request!'
      });
    }
    
    // delete user
    await file.destroy();
    
    res.status(200).json({
      message: 'File deleted successfully!'
    });
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
}