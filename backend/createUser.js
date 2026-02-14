const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'user@example.com' });
    if (existingUser) {
      console.log('Regular user already exists!');
      console.log('Email: user@example.com');
      console.log('Password: user123');
      process.exit(0);
    }

    // Create regular user
    const regularUser = new User({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });

    await regularUser.save();
    console.log('Regular user created successfully!');
    console.log('Email: user@example.com');
    console.log('Password: user123');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createUser();