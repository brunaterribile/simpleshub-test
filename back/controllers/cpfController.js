const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { db } = require('../firebaseConfig');

// Função para limpar e normalizar o texto do PDF
function cleanPdfText(text) {
  return text
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

exports.uploadPdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
  }

  const filePath = path.resolve(req.file.path);
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
    
    // Verificação do cabeçalho do PDF
    const header = dataBuffer.toString('ascii', 0, 5);
    if (header !== '%PDF-') {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'O arquivo não é um PDF válido' });
    }

    // Configurações para o pdf-parse
    const options = {
      max: 0, // Processa todas as páginas
      pagerender: null, // Usa o renderizador padrão
    };

    const pdfData = await pdfParse(dataBuffer, options);
    const text = cleanPdfText(pdfData.text);

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
        createdAt: timestamp,
      };
    });

    await ref.update(updates);

    return res.status(200).json({
      success: true,
      cpfs,
      message: 'PDF processado com sucesso!',
    });

  } catch (error) {
    console.error('Erro ao processar PDF:', error);
    
    let errorMessage = 'Erro ao processar PDF';
    if (error.message.includes('Invalid number: +')) {
      errorMessage = 'O PDF contém caracteres inválidos. Por favor, tente converter o PDF para um formato mais simples.';
    } else if (error.message.includes('bad XRef entry')) {
      errorMessage = 'O PDF está corrompido ou em um formato não suportado. Por favor, tente converter o PDF para um formato mais simples.';
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
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

exports.clearHistory = async (req, res) => {
  try {
    const ref = db.ref('cpfs');
    await ref.remove();
    res.status(200).json({ 
      success: true, 
      message: 'Histórico de CPFs limpo com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao limpar histórico de CPFs' 
    });
  }
};
