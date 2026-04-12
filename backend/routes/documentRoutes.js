const express = require('express');
const router  = express.Router();
const {
  createDocument, getAllDocuments, getApprovedDocuments,
  getMyDocuments, getDocument, searchDocuments,
  reviewDocument, updateDocument, deleteDocument, downloadDocument
} = require('../controllers/documentController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/',                protect, upload.single('file'), createDocument);

router.get('/',                 protect, admin, getAllDocuments);
router.get('/approved',         protect, getApprovedDocuments);
router.get('/my-documents',     protect, getMyDocuments);
router.get('/search',           protect, searchDocuments);
router.get('/:id',              protect, getDocument);
router.put('/:id/review',       protect, admin, reviewDocument);
router.put('/:id',              protect, admin, updateDocument);
router.delete('/:id',           protect, admin, deleteDocument);
router.get('/:id/download',     protect, downloadDocument);

module.exports = router;
