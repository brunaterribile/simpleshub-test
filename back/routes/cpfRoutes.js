import express from 'express';
import multer from 'multer';
import { uploadPdf, getHistory } from '../controllers/cpfController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('pdf'), uploadPdf);
router.get('/history', getHistory);

export default router;