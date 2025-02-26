import express from 'express';
import cors from 'cors';
import Loki from 'lokijs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import pdfRoutes from './routes/pdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use(express.static(path.join(__dirname, '../uploads')));

// Initialize LokiJS
const db = new Loki('pdf-sample-platform.db');

// Create collections
const users = db.addCollection('users');
const pdfs = db.addCollection('pdfs');

// Add collections to app.locals so they can be accessed in routes
app.locals.users = users;
app.locals.pdfs = pdfs;

app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});