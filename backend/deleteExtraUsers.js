const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    // Delete all users except admin@example.com
    const result = await User.deleteMany({ 
      email: { $ne: "admin@example.com" } 
    });
    
    console.log(`Deleted ${result.deletedCount} users`);
    
    // Show remaining users
    const users = await User.find();
    console.log('\nRemaining users:');
    users.forEach(u => {
      console.log(`- ${u.name} (${u.email}) - ${u.role}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
