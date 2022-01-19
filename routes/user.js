const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.get('/', userCtrl.getUsers);
router.get('/:id', userCtrl.getUserById);


module.exports = router;