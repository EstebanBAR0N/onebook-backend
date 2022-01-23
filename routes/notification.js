const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const notificationCtrl = require('../controllers/notification');

router.get('/', auth, notificationCtrl.getNotifications);
router.post('/', auth, notificationCtrl.createNotification);

router.get('/:id', auth, notificationCtrl.getNotificationById);
router.put('/:id', auth, notificationCtrl.updateNotification);
router.delete('/:id', auth, notificationCtrl.deleteNotification);


module.exports = router;