import express from 'express';
import cors from 'cors';
import Loki from 'lokijs';
import authRoutes from './routes/auth.js';
import pdfRoutes from './routes/pdf.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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