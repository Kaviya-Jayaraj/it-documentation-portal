const mongoose = require('mongoose');
require('dotenv').config();

const Document = require('./models/Document');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    const documents = await Document.find().populate('uploadedBy');
    
    console.log(`Total documents: ${documents.length}\n`);
    
    if (documents.length === 0) {
      console.log('No documents found in database.');
    } else {
      documents.forEach(doc => {
        console.log(`- ${doc.title} (${doc.category})`);
        console.log(`  Uploaded by: ${doc.uploadedBy ? doc.uploadedBy.name : 'Unknown'}`);
        console.log(`  File: ${doc.filePath}\n`);
      });
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
