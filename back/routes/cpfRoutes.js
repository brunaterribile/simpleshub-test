const express = require('express');
const multer = require('multer');
const { uploadPdf, getHistory, clearHistory } = require('../controllers/cpfController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
console.log('upload', upload);

router.post('/upload', upload.single('pdf'), uploadPdf);
router.get('/history', getHistory);
router.delete('/clear', clearHistory);

module.exports = router;