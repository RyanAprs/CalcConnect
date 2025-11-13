#!/bin/bash

# Production script for running with Docker
echo "🚀 Starting Number Discussion Platform in production mode..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Please create it with production credentials."
    exit 1
fi

# Build and start containers in detached mode
echo "🔨 Building Docker containers..."
docker-compose up --build -d

echo "✅ Application running in background at http://localhost:3000"
echo "📊 View logs: docker-compose logs -f"
echo "🛑 Stop: docker-compose down"
