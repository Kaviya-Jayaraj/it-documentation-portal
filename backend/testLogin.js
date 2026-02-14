const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    const email = 'admin@example.com';
    const password = 'admin123';
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }
    
    console.log('User found:', user.name);
    console.log('Email:', user.email);
    console.log('Stored password hash:', user.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('\nPassword match:', isMatch);
    
    if (isMatch) {
      console.log('✓ Login should work!');
    } else {
      console.log('✗ Password does not match');
      console.log('\nFixing password...');
      
      // Update with correct password
      user.password = await bcrypt.hash(password, 10);
      await user.save({ validateBeforeSave: false });
      
      console.log('✓ Password fixed! Try logging in again.');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
