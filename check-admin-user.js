const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/civic-ai', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            directConnection: true,
        });

        console.log('✅ Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@digitalindia.gov.in' });
        
        if (admin) {
            console.log('✅ Admin user found!');
            console.log('Name:', admin.name);
            console.log('Email:', admin.email);
            console.log('Role:', admin.role);
            console.log('Verified:', admin.verified);
            console.log('Password hash exists:', !!admin.password);
        } else {
            console.log('❌ Admin user not found');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAdmin();
