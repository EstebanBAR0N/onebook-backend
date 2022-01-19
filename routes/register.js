const express = require('express');
const router = express.Router();

const registerCtrl = require('../controllers/register');

router.post('/', registerCtrl.signup);


module.exports = router;