const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const logCtrl = require('../controllers/log');

router.get('/', auth, logCtrl.getLogs);
router.post('/', auth, logCtrl.createLog);

router.get('/:id', auth, logCtrl.getLogById);


module.exports = router;