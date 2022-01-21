const express = require('express');
const router = express.Router();

const tokenCtrl = require('../controllers/token');

router.get('/', tokenCtrl.getTokens);
router.get('/:id', tokenCtrl.getTokenById);


module.exports = router;