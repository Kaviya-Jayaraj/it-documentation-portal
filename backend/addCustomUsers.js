const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function addCustomUsers() {
  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('kavs@204', 10);
    const userPassword = await bcrypt.hash('keerthi@207', 10);

    // Delete existing users (optional)
    await User.deleteMany({});

    // Add your admin account
    await User.create({
      name: 'Kaviya J',
      email: 'kaviya.cs23@bitsathy.ac.in',
      password: adminPassword,
      role: 'admin'
    });

    // Add your friend's user account
    await User.create({
      name: 'Kiruthika',
      email: 'kiruthika.cs23@bitsathy.ac.in',
      password: userPassword,
      role: 'user'
    });

    console.log('Custom users created successfully!');
    console.log('Admin: kaviya.cs23@bitsathy.ac.in / kavs@204');
    console.log('User: kiruthika.cs23@bitsathy.ac.in / keerthi@207');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addCustomUsers();