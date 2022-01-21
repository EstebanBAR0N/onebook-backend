const { param } = require("express/lib/request");
const { Op } = require("sequelize");
const { models } = require('../sequelize');
const helpers = require('../utils/helpers');


// return all files
exports.getFiles = async (req, res, next) => {
  try {
    // récupère les paramètre de la requête
    const params = helpers.getFileParams(req);

    console.log(params)

    // // vérifie les paramètres passé par l'utilisateur
    if (helpers.corruptedArg(params)) {
      res.status(403).json({
        error: 'Invalid data passed in the url'
      });

      return;
    }

    // génère la query en fonction des paramètres
    let query = {};
    let whereQuery = null;
    
    // userId et format
    if (params['userId'] && params['format']) {
      whereQuery = { 
        where: {
          [Op.and]: {
            userId : { [Op.eq]: params['userId'] },
            format : { [Op.eq]: params['format'] }
          }
        }
      }
    }
    else if (params['userId']) {
      whereQuery = { 
        where: {
          userId : { [Op.eq]: params['userId'] }         
        }
      }
    }
    else if (params['format']) {
      whereQuery = { 
        where: {
          format : { [Op.eq]: params['format'] }         
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

    console.log(query);

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
          id : {
            [Op.eq]: req.body.userId
          }
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