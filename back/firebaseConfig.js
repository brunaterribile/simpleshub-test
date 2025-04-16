const admin = require('firebase-admin');
const serviceAccount = require('./firebaseAdminConfig.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://cpf-collector-default-rtdb.firebaseio.com/'
});

const db = admin.database();       
module.exports = { db };
