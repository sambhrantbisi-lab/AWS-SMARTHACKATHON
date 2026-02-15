#!/bin/bash

echo "🚀 Starting Civic AI Assistant..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   sudo systemctl start mongod"
    echo "   OR"
    echo "   mongod --dbpath /path/to/your/db"
    exit 1
fi

# Start the backend server
echo "📡 Starting backend server..."
node server.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server started successfully
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Backend server started successfully on port 5000"
else
    echo "❌ Failed to start backend server"
    exit 1
fi

echo ""
echo "🎉 Civic AI Assistant is ready!"
echo ""
echo "📋 Available endpoints:"
echo "   • Backend API: http://localhost:5000"
echo "   • Frontend: Start with 'cd client && npm start'"
echo ""
echo "🛠  To seed the database with sample data:"
echo "   node seed.js"
echo ""
echo "Press Ctrl+C to stop the server"

# Keep the script running
wait $SERVER_PID