#!/bin/bash

# Development script for running with Docker
echo "🐳 Starting Number Discussion Platform with Docker..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created. Please update with your actual credentials."
    exit 1
fi

# Build and start containers
echo "🔨 Building Docker containers..."
docker-compose up --build

echo "✅ Application running at http://localhost:3000"
