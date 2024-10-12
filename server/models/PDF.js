import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  title: { type: String, required: true },
  file: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const PDF = mongoose.model('PDF', pdfSchema);

export default PDF;