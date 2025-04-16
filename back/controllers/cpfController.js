const fs = require('fs');
const pdfParse = require('pdf-parse');
const { db } = require('../firebaseConfig');

exports.uploadPdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
  }

  const filePath = req.file.path;
  console.log('filePath', filePath);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'Arquivo não encontrado' });
    }

    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'O arquivo está vazio' });
    }

    const dataBuffer = fs.readFileSync(filePath);
    
    if (dataBuffer.toString('ascii', 0, 5) !== '%PDF-') {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'O arquivo não parece ser um PDF válido' });
    }

    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    const cpfRegex = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g;
    const cpfs = [...new Set(text.match(cpfRegex) || [])];
    console.log('cpfs', cpfs);

    if (cpfs.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Nenhum CPF encontrado no PDF' });
    }

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

    return res.status(200).json({ 
      success: true,
      cpfs: cpfs,
      message: 'PDF processado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao processar PDF:', error);
    
    let errorMessage = 'Erro ao processar PDF';
    if (error.message.includes('bad XRef entry')) {
      errorMessage = 'O PDF está corrompido ou em um formato não suportado';
    } else if (error.message.includes('Invalid PDF structure')) {
      errorMessage = 'Estrutura do PDF inválida';
    }
    
    return res.status(500).json({ 
      success: false,
      error: errorMessage 
    });
  } finally {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
      console.error('Erro ao limpar arquivo temporário:', cleanupError);
    }
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
