const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

exports.createDocument = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const document = await Document.create({
      title,
      description,
      category,
      filePath: req.file.path,
      uploadedBy: req.user._id
    });

    res.status(201).json({ message: 'Document uploaded successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate('uploadedBy', 'name email');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ document });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchDocuments = async (req, res) => {
  try {
    const { query } = req.query;
    
    const documents = await Document.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).populate('uploadedBy', 'name email');

    res.json({ documents });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.title = title || document.title;
    document.description = description || document.description;
    document.category = category || document.category;

    await document.save();

    res.json({ message: 'Document updated successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const filePath = path.resolve(document.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
