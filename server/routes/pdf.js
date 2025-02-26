import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticateToken, authorizePublisher } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/upload', authenticateToken, authorizePublisher, upload.single('pdf'), async (req, res) => {
  try {
    const { title } = req.body;
    const pdfs = req.app.locals.pdfs;
    
    // Store only the relative path by removing the base directory path
    const relativePath = req.file.path.replace(path.join(__dirname, '../..'), '');
    
    const newPDF = pdfs.insert({
      title,
      file: relativePath,
      uploadedBy: req.user.userId,
      assignedTo: [],
    });
    res.status(201).json({ message: 'PDF uploaded successfully', pdf: newPDF });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading PDF', error: error.message });
  }
});

router.get('/list', authenticateToken, async (req, res) => {
  try {
    const pdfs = req.app.locals.pdfs;
    const users = req.app.locals.users;
    let pdfList;
    if (req.user.role === 'publisher') {
      pdfList = pdfs.find({ uploadedBy: req.user.userId });
    } else {
      const user = users.findOne({ $loki: req.user.userId });
      pdfList = pdfs.find({ assignedTo: { $contains: req.user.userId } });
    }
    res.json(pdfList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching PDFs', error: error.message });
  }
});

router.post('/assign', authenticateToken, authorizePublisher, async (req, res) => {
  try {
    const { pdfId, userId } = req.body;
    const pdfs = req.app.locals.pdfs;
    const users = req.app.locals.users;
    
    const pdf = pdfs.findOne({ $loki: parseInt(pdfId) });
    const user = users.findOne({ $loki: parseInt(userId) });
    
    if (!pdf || !user) {
      return res.status(404).json({ message: 'PDF or User not found' });
    }

    const userIdStr = userId.toString();
    if (!pdf.assignedTo.includes(userIdStr)) {
      pdf.assignedTo.push(userIdStr);
      pdfs.update(pdf);
    }

    res.json({ message: 'PDF assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning PDF', error: error.message });
  }
});

export default router;