const { models } = require('../sequelize');
const helpers = require('../utils/helpers');



// return all notifications
exports.getNotifications = async (req, res, next) => {
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

    // récupère toutes les notifications
    const notifications = await models.notification.findAll();

    res.status(200).json(notifications);
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
  }
};

// create a new notification
exports.createNotification = async (req, res, next) => {
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
      !helpers.isValidString(req.body.name) ||
      !helpers.isValidString(req.body.message)
    ) {
      res.status(403).json({
        error: 'Invalid data'
      });
      return;
    }

    // create new notification
    const notification = new models.notification({
      name: req.body.name,
      message: req.body.message,
    });

    // save new notification to database
    await notification.save();

    res.status(201).json({
        message: 'Notification added successfully!'
    });
  }
  catch (err) {
    res.status(500).json({
        error: 'Server Error'
    })
  }
};

// return the notification with the id : req.params.id
exports.getNotificationById = async (req, res, next) => {
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

    // récupère le notification avec l'id : "id"
    const notification = await models.notification.findByPk(id);
    if (notification) {
      res.status(200).json(notification);
    } else {
      res.status(404).json({
        error: 'Notification not found'
      });
    }
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
    console.error(err);
  }
};


// modify a notification
exports.updateNotification = async (req, res, next) => {
  try {
    const id = helpers.getIdParam(req);

    // récupère le notification avec l'id : "id"
    const notificationToModify = await models.notification.findByPk(id);

    // si la notif n'existe pas
    if (!notificationToModify) {
      return res.status(404).json({
        error: 'File not found!'
      });
    }

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
    
    // check user info
    if (
      !helpers.isValidString(req.body.name) ||
      !helpers.isValidString(req.body.message)
    ) {
      res.status(406).json({
        error: 'Invalid data, request not acceptable!'
      });
      return;
    }
    
    // modification de la notification
    const dataToModify = { 
      name : req.body.name,
      message : req.body.message 
    };
    
    await models.notification.update(dataToModify, { where : { id : id } });
    
    res.status(200).json({
      message: 'Notification updated successfully!'
    });
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
    console.error(err);
  }
}


// delete a notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const id = helpers.getIdParam(req);

    // récupère le file avec l'id : "id"
    const notification = await models.notification.findByPk(id);

    // si le notification n'existe pas
    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found!'
      });
    }

    // si ce n'est pas son compte ou que le user n'est pas admin, pas le droit de supprimer
    const user = await models.user.findByPk(req.auth.userId);
    if (!user) {
      return res.status(404).json({
        error: 'We can\'t find your id!'
      });
    }

    if (!user.admin) {
      return res.status(403).json({
        error: 'Unauthorized request!'
      });
    }
    
    // delete user
    await notification.destroy();
    
    res.status(200).json({
      message: 'Notification deleted successfully!'
    });
  }
  catch (err) {
    res.status(500).json({
      error: 'Server Error'
    });
    console.error(err);
  }
}
