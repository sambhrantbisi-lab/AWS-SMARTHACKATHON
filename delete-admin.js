const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function deleteAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/civic-ai', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            directConnection: true,
        });

        console.log('✅ Connected to MongoDB');

        const result = await User.deleteOne({ email: 'admin@digitalindia.gov.in' });
        
        if (result.deletedCount > 0) {
            console.log('✅ Admin user deleted');
        } else {
            console.log('⚠️  Admin user not found');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

deleteAdmin();
