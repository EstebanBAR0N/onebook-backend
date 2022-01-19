const express = require('express');
const router = express.Router();

const tokenCtrl = require('../controllers/token');

router.get('/', tokenCtrl.getTokens);
router.post('/', tokenCtrl.createToken);

router.get('/:id', tokenCtrl.getTokenById);


module.exports = router;