const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, required: true },
  filePath:    { type: String, required: true },
  uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  remark:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
