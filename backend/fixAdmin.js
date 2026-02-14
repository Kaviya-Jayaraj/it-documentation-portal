const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    // Delete all users
    await mongoose.connection.collection('users').deleteMany({});
    console.log('Cleared all users\n');
    
    // Create admin with properly hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await mongoose.connection.collection('users').insertOne({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✓ Admin user created successfully!\n');
    console.log('Login with:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
