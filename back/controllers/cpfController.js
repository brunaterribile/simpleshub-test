import fs from 'fs';
import pdfParse from 'pdf-parse';
import { db } from '../firebaseConfig.js';

export const uploadPdf = async (req, res) => {
  const filePath = req.file.path;

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    const cpfRegex = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g;
    const cpfs = [...new Set(text.match(cpfRegex) || [])];

    const ref = db.ref('cpfs');
    const updates = {};
    const timestamp = new Date().toISOString();
    
    cpfs.forEach((cpf) => {
      const key = cpf.replace(/\D/g, '');
      updates[key] = {
        number: cpf,
        createdAt: timestamp
      };
    });

    await ref.update(updates);

    res.status(200).json({ cpfs });
  } catch (error) {
    console.error('Erro ao processar PDF:', error);
    res.status(500).json({ error: 'Erro ao processar PDF' });
  } finally {
    fs.unlinkSync(filePath);
  }
};

exports.getHistory = async (req, res) => {
  try {
    const snapshot = await db.ref('cpfs').once('value');
    const data = snapshot.val();
    
    const cpfs = data ? Object.values(data).sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }) : [];
    
    res.status(200).json({ cpfs });
  } catch (error) {
    console.error('Erro ao buscar CPFs:', error);
    res.status(500).json({ error: 'Erro ao buscar CPFs' });
  }
};
