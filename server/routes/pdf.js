import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticateToken, authorizePublisher } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
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
    const newPDF = pdfs.insert({
      title,
      file: req.file.path,
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

    if (!pdf.assignedTo.includes(userId)) {
      pdf.assignedTo.push(userId);
      pdfs.update(pdf);
    }

    res.json({ message: 'PDF assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning PDF', error: error.message });
  }
});

export default router;