const { models } = require('../sequelize');
const helpers = require('../utils/helpers');


// return all logs
exports.getLogs = async (req, res, next) => {
  try {
    // check si le user est admin
    const user = await models.user.findByPk(req.auth.userId);
    if (!user) {
      return res.status(404).json({
        error: 'We can\'t find your user id!'
      });
    }

    if (!user.admin) {
      return res.status(403).json({
        error: 'Unauthorized request!'
      });
    }

    // récupère toutes les logs
    const logs = await models.log.findAll();

    res.status(200).json(logs);
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
};

// create a new log
exports.createLog = async (req, res, next) => {
  try {
    // check si le user est admin
    const user = await models.user.findByPk(req.auth.userId);
    if (!user) {
      return res.status(404).json({
        error: 'We can\'t find your user id!'
      });
    }
    
    if (!user.admin) {
      return res.status(403).json({
        error: 'Unauthorized request!'
      });
    }

    // check si les données sont valides
    if (
      !helpers.isValidString(req.body.message)
    ) {
      res.status(403).json({
        error: 'Invalid data'
      });
      return;
    }

    // create new log
    const log = new models.log({
      message: req.body.message,
      userId: req.auth.userId,
    });

    // save new log to database
    await log.save();

    res.status(201).json({
        message: 'Log added successfully!'
    });
  }
  catch (err) {
    res.status(500).json({
        error: 'Server Error'
    })
  }
};

// return the log with the id : req.params.id
exports.getLogById = async (req, res, next) => {
  try {
    // check si le user est admin
    const user = await models.user.findByPk(req.auth.userId);
    if (!user) {
      return res.status(404).json({
        error: 'We can\'t find your user id!'
      });
    }

    if (!user.admin) {
      return res.status(403).json({
        error: 'Unauthorized request!'
      });
    }

    const id = helpers.getIdParam(req);

    // récupère la log avec l'id : "id"
    const log = await models.log.findByPk(id);
    if (log) {
      res.status(200).json(log);
    } else {
      res.status(404).json({
        error: 'Log not found'
      });
    }
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
};