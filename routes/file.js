const express = require('express');

const auth = require('../middleware/auth');
const fileCtrl = require('../controllers/file');

const router = express.Router();

router.get('/', fileCtrl.getFiles);
router.post('/', fileCtrl.createFile);

router.get('/:id', fileCtrl.getFileById);
router.put('/:id', auth, fileCtrl.updateFile);
router.delete('/:id', auth, fileCtrl.deleteFile);


module.exports = router;