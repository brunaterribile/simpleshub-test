const express = require('express');
const { uploadPdf, getHistory, clearHistory } = require('../controllers/cpfController');

const router = express.Router();

router.post('/upload', express.raw({ type: 'application/pdf', limit: '10mb'}), uploadPdf);
router.get('/history', getHistory);
router.delete('/clear', clearHistory);

module.exports = router;