#!/bin/bash

# CloudVault - GitHub Labels Setup Script
# This script creates all necessary labels for the project

echo "🏷️  Setting up GitHub labels for CloudVault..."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub CLI:"
    gh auth login
fi

echo "Creating Priority labels..."
gh label create "🔴 Critical" --color "d73a4a" --description "Blocks other work, must be done immediately" --force
gh label create "🟠 High" --color "ff9800" --description "Important for current sprint" --force
gh label create "🟡 Medium" --color "ffc107" --description "Should be done soon" --force
gh label create "🟢 Low" --color "4caf50" --description "Nice to have, can be deferred" --force

echo "Creating Type labels..."
gh label create "🎨 Frontend" --color "1976d2" --description "UI/UX work" --force
gh label create "⚙️ Backend" --color "388e3c" --description "Server-side logic" --force
gh label create "🗄️ Database" --color "7b1fa2" --description "Data model changes" --force
gh label create "🔧 DevOps" --color "f57c00" --description "Infrastructure/deployment" --force
gh label create "🐛 Bug" --color "d32f2f" --description "Fixing defects" --force
gh label create "📚 Documentation" --color "0288d1" --description "Docs and guides" --force
gh label create "🧪 Testing" --color "00796b" --description "Test creation/updates" --force

echo "Creating Phase labels..."
gh label create "📦 Phase 1: MVP" --color "e3f2fd" --description "Core functionality" --force
gh label create "🎯 Phase 2: Enhanced" --color "f3e5f5" --description "User experience" --force
gh label create "🚀 Phase 3: Production" --color "e8f5e9" --description "Performance & security" --force
gh label create "🎉 Phase 4: Launch" --color "fff3e0" --description "Testing & deployment" --force

echo "Creating Component labels..."
gh label create "🔐 Auth" --color "3f51b5" --description "Authentication/authorization" --force
gh label create "📁 Files" --color "2196f3" --description "File management" --force
gh label create "📂 Folders" --color "03a9f4" --description "Folder operations" --force
gh label create "🔗 Sharing" --color "00bcd4" --description "File sharing/transfers" --force
gh label create "💾 Storage" --color "009688" --description "Storage management" --force
gh label create "👤 Profile" --color "4caf50" --description "User profiles" --force
gh label create "📊 Analytics" --color "8bc34a" --description "Tracking/reporting" --force
gh label create "🔔 Notifications" --color "cddc39" --description "Alerts/emails" --force

echo ""
echo "✅ All labels created successfully!"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/BPSDynamic/cloudvault/labels to verify"
echo "2. Create GitHub Project following github-project-setup.md"
echo "3. Start creating issues for Sprint 1"
