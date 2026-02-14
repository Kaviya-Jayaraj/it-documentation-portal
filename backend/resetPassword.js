const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    // List all users
    const users = await User.find();
    console.log('Existing users:');
    users.forEach(u => {
      console.log(`- ${u.email} (${u.role})`);
    });
    
    // Reset admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const result = await User.updateOne(
      { email: 'admin@example.com' },
      { password: hashedPassword }
    );
    
    if (result.matchedCount > 0) {
      console.log('\n✓ Admin password reset successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    } else {
      console.log('\n✗ Admin user not found. Creating new admin...');
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✓ Admin user created!');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
