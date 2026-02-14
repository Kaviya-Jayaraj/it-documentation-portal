const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Kaviya',
    email: 'kaviya.cs23@bitsathy.ac.in',
    password: 'kaviya123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'john123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'jane123',
    role: 'user'
  },
  {
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    password: 'robert123',
    role: 'user'
  },
  {
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    password: 'sarah123',
    role: 'user'
  },
  {
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    password: 'michael123',
    role: 'user'
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users\n');
    
    // Create new users
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });
      
      console.log(`✓ Created ${userData.role}: ${userData.name} (${userData.email})`);
    }
    
    console.log('\n=== All Users Created Successfully ===\n');
    console.log('Login Credentials:');
    console.log('------------------');
    users.forEach(u => {
      console.log(`${u.name} (${u.role})`);
      console.log(`  Email: ${u.email}`);
      console.log(`  Password: ${u.password}\n`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
