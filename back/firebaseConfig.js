import admin from 'firebase-admin';
import serviceAccount from './firebaseAdminConfig.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://cpf-collector-default-rtdb.firebaseio.com/'
});

const db = admin.database();       
export { db };
