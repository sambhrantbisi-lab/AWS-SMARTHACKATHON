const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civic-ai', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            directConnection: true,
        });

        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@digitalindia.gov.in' });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log('Email: admin@digitalindia.gov.in');
            console.log('You can reset the password by deleting and re-running this script');
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@digitalindia.gov.in',
            password: 'admin123', // Will be hashed by User model pre-save hook
            role: 'admin',
            phone: '1800-000-0000',
            aadhaar: '0000-0000-0000',
            verified: true
        });

        await adminUser.save();

        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('='.repeat(60));
        console.log('ADMIN CREDENTIALS');
        console.log('='.repeat(60));
        console.log('Email:    admin@digitalindia.gov.in');
        console.log('Password: [Hidden for security - default is admin123]');
        console.log('='.repeat(60));
        console.log('');
        console.log('⚠️  IMPORTANT: Change the password after first login!');
        console.log('');
        console.log('Access admin panel at: http://localhost:5000/admin.html');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser();
