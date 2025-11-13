#!/bin/bash

# Setup script for local development
echo "🚀 Setting up Number Discussion Platform..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version OK: $(node -v)"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your Supabase credentials"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run database migrations in Supabase SQL Editor:"
echo "   - Execute scripts/001_create_tables.sql"
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "Or use Docker:"
echo "   chmod +x scripts/docker-dev.sh"
echo "   ./scripts/docker-dev.sh"
