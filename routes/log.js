const express = require('express');
const router = express.Router();

const logCtrl = require('../controllers/log');

router.get('/', logCtrl.getLogs);
router.post('/', logCtrl.createLog);

router.get('/:id', logCtrl.getLogById);


module.exports = router;