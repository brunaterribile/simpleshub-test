const express = require('express');
const multer = require('multer');
const { uploadPdf, getHistory } = require('../controllers/cpfController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
console.log('upload', upload);

router.post('/upload', upload.single('pdf'), uploadPdf);
router.get('/history', getHistory);

module.exports = router;