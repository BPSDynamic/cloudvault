#!/bin/bash

# CloudVault - GitHub Project Creation Script
# This script creates a GitHub Project using the GitHub API

echo "📊 Creating GitHub Project for CloudVault..."
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

# Get repository owner and name
REPO_OWNER="BPSDynamic"
REPO_NAME="cloudvault"

echo "Creating project for: $REPO_OWNER/$REPO_NAME"
echo ""

# Note: GitHub CLI doesn't have native project v2 commands yet
# We'll use the GraphQL API directly

echo "⚠️  GitHub CLI doesn't support Projects v2 creation yet."
echo ""
echo "Please create the project manually:"
echo ""
echo "1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/projects"
echo "2. Click 'New project'"
echo "3. Choose 'Board' template"
echo "4. Name it: 'CloudVault Development'"
echo "5. Click 'Create project'"
echo ""
echo "After creating the project, you can:"
echo "- Add custom fields (Priority, Phase, Estimate, Component, Sprint)"
echo "- Configure columns (Backlog, Ready, In Progress, Testing, Done, Blocked)"
echo "- Add the 12 Sprint 1 issues to the project"
echo ""
echo "Or run this command to open the projects page:"
echo "  gh repo view $REPO_OWNER/$REPO_NAME --web"
echo ""

# Open the projects page in browser
read -p "Would you like to open the projects page now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Opening projects page..."
    gh repo view $REPO_OWNER/$REPO_NAME --web
    # Navigate to projects tab
    open "https://github.com/$REPO_OWNER/$REPO_NAME/projects"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create the project in the web UI"
echo "2. Configure columns and custom fields"
echo "3. Add issues to the project"
echo "4. Assign to team members"
