const express = require('express');
const router = express.Router();

const fileCtrl = require('../controllers/file');

router.get('/', fileCtrl.getFiles);
router.post('/', fileCtrl.createFile);

router.get('/:id', fileCtrl.getFileById);


module.exports = router;