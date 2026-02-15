const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        directConnection: true
    });

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected successfully!');
        
        const admin = client.db().admin();
        const dbs = await admin.listDatabases();
        
        console.log('\nDatabases:');
        dbs.databases.forEach(db => console.log(`  - ${db.name}`));
        
        await client.close();
        console.log('\n✅ Connection closed');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testConnection();
