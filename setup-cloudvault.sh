#!/bin/bash

# CloudVault Repository Setup Script
# Repository: https://github.com/BPSDynamic/cloudvault.git

echo "🚀 Setting up CloudVault repository..."

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Error: README.md not found. Please run this script from the cloudvault directory."
    exit 1
fi

# Configure git (if not already configured globally)
echo "📝 Configuring git..."
git config user.email "rendani@example.com" 2>/dev/null || true
git config user.name "Rendani Tshivhangani" 2>/dev/null || true

# Add all files
echo "📦 Adding files..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: CloudVault project setup"

# Add remote origin
echo "🔗 Adding remote origin..."
git remote add origin https://github.com/BPSDynamic/cloudvault.git

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo "✅ Setup complete! Your CloudVault repository is now on GitHub."
echo "🔗 View it at: https://github.com/BPSDynamic/cloudvault"
