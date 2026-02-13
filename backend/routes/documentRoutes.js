const express = require('express');
const router = express.Router();
const {
  createDocument,
  getAllDocuments,
  getDocument,
  searchDocuments,
  updateDocument,
  deleteDocument,
  downloadDocument
} = require('../controllers/documentController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, admin, upload.single('file'), createDocument);
router.get('/', protect, getAllDocuments);
router.get('/search', protect, searchDocuments);
router.get('/:id', protect, getDocument);
router.put('/:id', protect, admin, updateDocument);
router.delete('/:id', protect, admin, deleteDocument);
router.get('/:id/download', protect, downloadDocument);

module.exports = router;
