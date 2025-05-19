import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import serviceAccount from './firebaseServiceAccount.json';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  projectId: process.env.PROJECT_ID,
});

const adminAuth = admin.auth(); // ✅ ESSENCIAL

const app = express();
app.use(cors());
app.use(express.json());

app.post('/gerar-token', (req: Request, res: Response) => {
  (async () => {
    try {
      const { nome, admin: isAdmin } = req.body;
      const token = await admin.auth().createCustomToken(uid, { admin });

      res.json({ token });
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      res.status(500).json({ error: 'Erro ao gerar token' });
    }
  })();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
