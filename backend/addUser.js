const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    const hashedPassword = await bcrypt.hash('user123', 10);
    
    await mongoose.connection.collection('users').insertOne({
      name: 'Regular User',
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✓ User created successfully!\n');
    console.log('Login with:');
    console.log('Email: user@example.com');
    console.log('Password: user123');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
