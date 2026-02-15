const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testPassword() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/civic-ai', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            directConnection: true,
        });

        console.log('✅ Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@digitalindia.gov.in' });
        
        if (!admin) {
            console.log('❌ Admin user not found');
            process.exit(1);
        }

        console.log('Testing password comparison...');
        const isMatch = await admin.comparePassword('admin123');
        
        if (isMatch) {
            console.log('✅ Password matches!');
        } else {
            console.log('❌ Password does not match');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testPassword();
