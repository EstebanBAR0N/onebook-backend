const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const fileCtrl = require('../controllers/file');

router.get('/', fileCtrl.getFiles);
router.post('/', fileCtrl.createFile);

router.get('/:id', fileCtrl.getFileById);
router.put('/:id', auth, fileCtrl.updateFile);
// router.delete('/:id', auth, fileCtrl.deleteFile);

module.exports = router;