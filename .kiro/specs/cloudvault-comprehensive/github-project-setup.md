# GitHub Projects Setup Guide

This guide will help you create and configure a GitHub Project for CloudVault development.

---

## Quick Setup (5 minutes)

### Step 1: Create the Project

1. Go to your repository: https://github.com/BPSDynamic/cloudvault
2. Click on **"Projects"** tab at the top
3. Click **"New project"** button
4. Choose **"Board"** template
5. Name it: **"CloudVault Development"**
6. Click **"Create project"**

---

### Step 2: Configure Columns

GitHub Projects comes with default columns. Let's customize them:

1. Click on the **"⋮"** menu on each column to rename:
   - Rename "Todo" → **"📋 Backlog"**
   - Rename "In Progress" → **"🚧 In Progress"**
   - Rename "Done" → **"✅ Done"**

2. Add new columns by clicking **"+ Add column"**:
   - **"📝 Ready for Development"** (between Backlog and In Progress)
   - **"🧪 Testing / QA"** (between In Progress and Done)
   - **"🚫 Blocked"** (at the end)

**Final column order:**
1. 📋 Backlog
2. 📝 Ready for Development
3. 🚧 In Progress
4. 🧪 Testing / QA
5. ✅ Done
6. 🚫 Blocked

---

### Step 3: Add Custom Fields

1. Click **"⋮"** menu in top right → **"Settings"**
2. Click **"+ New field"** to add:

#### Field 1: Priority
- **Type**: Single select
- **Options**:
  - 🔴 Critical
  - 🟠 High
  - 🟡 Medium
  - 🟢 Low

#### Field 2: Phase
- **Type**: Single select
- **Options**:
  - 📦 Phase 1: MVP
  - 🎯 Phase 2: Enhanced
  - 🚀 Phase 3: Production
  - 🎉 Phase 4: Launch

#### Field 3: Estimate
- **Type**: Number
- **Description**: Story points or hours

#### Field 4: Component
- **Type**: Single select
- **Options**:
  - 🔐 Auth
  - 📁 Files
  - 📂 Folders
  - 🔗 Sharing
  - 💾 Storage
  - 👤 Profile
  - 📊 Analytics
  - 🔔 Notifications
  - 🧪 Testing
  - 📚 Documentation
  - 🔧 DevOps

#### Field 5: Sprint
- **Type**: Single select
- **Options**:
  - Sprint 1
  - Sprint 2
  - Sprint 3
  - Sprint 4
  - Sprint 5
  - Sprint 6
  - Sprint 7
  - Sprint 8
  - Backlog

---

### Step 4: Create Labels

Go to your repository → **Issues** → **Labels** → **New label**

Create these labels:

#### Priority Labels
- 🔴 **Critical** - `#d73a4a` - Blocks other work
- 🟠 **High** - `#ff9800` - Important for current sprint
- 🟡 **Medium** - `#ffc107` - Should be done soon
- 🟢 **Low** - `#4caf50` - Nice to have

#### Type Labels
- 🎨 **Frontend** - `#1976d2` - UI/UX work
- ⚙️ **Backend** - `#388e3c` - Server-side logic
- 🗄️ **Database** - `#7b1fa2` - Data model changes
- 🔧 **DevOps** - `#f57c00` - Infrastructure
- 🐛 **Bug** - `#d32f2f` - Fixing defects
- 📚 **Documentation** - `#0288d1` - Docs and guides
- 🧪 **Testing** - `#00796b` - Test creation

#### Phase Labels
- 📦 **Phase 1: MVP** - `#e3f2fd`
- 🎯 **Phase 2: Enhanced** - `#f3e5f5`
- 🚀 **Phase 3: Production** - `#e8f5e9`
- 🎉 **Phase 4: Launch** - `#fff3e0`

#### Component Labels
- 🔐 **Auth** - `#3f51b5`
- 📁 **Files** - `#2196f3`
- 📂 **Folders** - `#03a9f4`
- 🔗 **Sharing** - `#00bcd4`
- 💾 **Storage** - `#009688`
- 👤 **Profile** - `#4caf50`
- 📊 **Analytics** - `#8bc34a`
- 🔔 **Notifications** - `#cddc39`

---

## Automated Setup (Using GitHub CLI)

If you have GitHub CLI installed, you can use this script:

```bash
#!/bin/bash

# Install GitHub CLI if not installed
# brew install gh (macOS)
# See: https://cli.github.com/

# Authenticate
gh auth login

# Create labels
gh label create "🔴 Critical" --color "d73a4a" --description "Blocks other work"
gh label create "🟠 High" --color "ff9800" --description "Important for current sprint"
gh label create "🟡 Medium" --color "ffc107" --description "Should be done soon"
gh label create "🟢 Low" --color "4caf50" --description "Nice to have"

gh label create "🎨 Frontend" --color "1976d2" --description "UI/UX work"
gh label create "⚙️ Backend" --color "388e3c" --description "Server-side logic"
gh label create "🗄️ Database" --color "7b1fa2" --description "Data model changes"
gh label create "🔧 DevOps" --color "f57c00" --description "Infrastructure"
gh label create "🐛 Bug" --color "d32f2f" --description "Fixing defects"
gh label create "📚 Documentation" --color "0288d1" --description "Docs and guides"
gh label create "🧪 Testing" --color "00796b" --description "Test creation"

gh label create "📦 Phase 1: MVP" --color "e3f2fd"
gh label create "🎯 Phase 2: Enhanced" --color "f3e5f5"
gh label create "🚀 Phase 3: Production" --color "e8f5e9"
gh label create "🎉 Phase 4: Launch" --color "fff3e0"

gh label create "🔐 Auth" --color "3f51b5"
gh label create "📁 Files" --color "2196f3"
gh label create "📂 Folders" --color "03a9f4"
gh label create "🔗 Sharing" --color "00bcd4"
gh label create "💾 Storage" --color "009688"
gh label create "👤 Profile" --color "4caf50"
gh label create "📊 Analytics" --color "8bc34a"
gh label create "🔔 Notifications" --color "cddc39"

echo "✅ Labels created successfully!"
```

Save this as `scripts/setup-labels.sh` and run:
```bash
chmod +x scripts/setup-labels.sh
./scripts/setup-labels.sh
```

---

## Creating Issues from Tickets

### Manual Method (Recommended for first sprint)

For Sprint 1, create these issues manually:

#### Issue 1: Create TypeScript Data Model Interfaces
```
Title: Create TypeScript Data Model Interfaces
Labels: 🔴 Critical, ⚙️ Backend, 📦 Phase 1: MVP, 🔐 Auth
Assignees: [Backend Dev]

Description:
Create TypeScript interfaces for all data models used throughout the application.

**Acceptance Criteria:**
- [ ] User interface with all fields defined
- [ ] Folder interface with relationships
- [ ] File interface with metadata fields
- [ ] ShareLink interface for transfers
- [ ] Analytics interface for event tracking
- [ ] FileMetadata interface for S3 metadata
- [ ] Transfer interface for application state
- [ ] All interfaces exported from `src/types/models.ts`

**Files to Create:**
- `src/types/models.ts`
- `src/types/index.ts`

**Estimate:** 3 story points
**Sprint:** Sprint 1
**Requirements:** 1.1, 1.2, 1.3, 1.4, 1.5
```

Repeat for all Sprint 1 tickets...

---

### Automated Method (Using Script)

I'll create a script to generate issues from the tickets file:

```bash
#!/bin/bash

# This script creates GitHub issues from tickets.md
# Requires: GitHub CLI (gh)

# Issue 1.1
gh issue create \
  --title "Create TypeScript Data Model Interfaces" \
  --body "Create TypeScript interfaces for all data models.

**Acceptance Criteria:**
- [ ] User interface with all fields defined
- [ ] Folder interface with relationships
- [ ] File interface with metadata fields
- [ ] ShareLink interface for transfers
- [ ] Analytics interface for event tracking
- [ ] FileMetadata interface for S3 metadata
- [ ] Transfer interface for application state
- [ ] All interfaces exported from src/types/models.ts

**Files to Create:**
- src/types/models.ts
- src/types/index.ts

**Estimate:** 3 story points
**Requirements:** 1.1, 1.2, 1.3, 1.4, 1.5" \
  --label "🔴 Critical,⚙️ Backend,📦 Phase 1: MVP,🔐 Auth" \
  --project "CloudVault Development"

# Issue 1.2
gh issue create \
  --title "Define Service Interface Contracts" \
  --body "Define TypeScript interfaces for all service layer methods.

**Acceptance Criteria:**
- [ ] AuthService interface with all methods
- [ ] S3Service interface with upload/download methods
- [ ] DynamoService interface with CRUD operations
- [ ] LambdaService interface with function calls
- [ ] Request/Response types for each method
- [ ] All interfaces documented with JSDoc comments

**Files to Create:**
- src/types/services.ts

**Estimate:** 2 story points
**Requirements:** 1.1, 1.2, 1.3, 1.4, 1.5" \
  --label "🔴 Critical,⚙️ Backend,📦 Phase 1: MVP,🔐 Auth" \
  --project "CloudVault Development"

# Continue for all tickets...
```

---

## Project Views

Create different views for different perspectives:

### View 1: Sprint Board (Default)
- **Filter**: Sprint = "Sprint 1"
- **Group by**: Status (columns)
- **Sort by**: Priority

### View 2: Roadmap
- **Layout**: Roadmap
- **Group by**: Phase
- **Sort by**: Start date

### View 3: Team View
- **Group by**: Assignee
- **Filter**: Status != "Done"
- **Sort by**: Priority

### View 4: Backlog
- **Filter**: Status = "Backlog"
- **Group by**: Phase
- **Sort by**: Priority

To create views:
1. Click **"⋮"** menu → **"New view"**
2. Choose layout (Board, Table, or Roadmap)
3. Configure filters and grouping
4. Save view

---

## Automation Workflows

### Workflow 1: Auto-add to Project
Create `.github/workflows/add-to-project.yml`:

```yaml
name: Add issues to project

on:
  issues:
    types:
      - opened

jobs:
  add-to-project:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/add-to-project@v0.5.0
        with:
          project-url: https://github.com/orgs/BPSDynamic/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Workflow 2: Auto-move on PR
Create `.github/workflows/move-to-testing.yml`:

```yaml
name: Move to Testing on PR

on:
  pull_request:
    types:
      - opened

jobs:
  move-to-testing:
    runs-on: ubuntu-latest
    steps:
      - name: Move linked issues to Testing
        uses: actions/github-script@v6
        with:
          script: |
            // Get linked issues
            const pr = context.payload.pull_request;
            // Move to Testing column
            // (Implementation depends on your project structure)
```

---

## Quick Start Checklist

Use this checklist to set up your project:

- [ ] Create GitHub Project named "CloudVault Development"
- [ ] Configure 6 columns (Backlog, Ready, In Progress, Testing, Done, Blocked)
- [ ] Add 5 custom fields (Priority, Phase, Estimate, Component, Sprint)
- [ ] Create all labels (Priority, Type, Phase, Component)
- [ ] Create 4 views (Sprint Board, Roadmap, Team View, Backlog)
- [ ] Create Sprint 1 issues (12 issues)
- [ ] Assign issues to team members
- [ ] Set up automation workflows (optional)
- [ ] Link project to repository
- [ ] Share project with team

---

## Sprint 1 Issues to Create

Here are the 12 issues for Sprint 1:

1. **Create TypeScript Data Model Interfaces** (3 pts)
2. **Define Service Interface Contracts** (2 pts)
3. **Create Error Response Types** (2 pts)
4. **Set Up Utility Functions** (3 pts)
5. **Add MFA Setup Flow** (8 pts)
6. **Create MFA UI Components** (5 pts)
7. **Implement Token Refresh Mechanism** (3 pts)
8. **Add Session Persistence** (3 pts)
9. **Enhance Auth Error Handling** (4 pts)
10. **Set up AWS Development Environment** (5 pts)
11. **Configure Amplify Gen 2 Sandbox** (3 pts)
12. **Set up CI/CD Pipeline (Basic)** (4 pts)

**Total: 45 story points**

---

## Tips for Success

### 1. Start Small
- Create Sprint 1 issues first
- Get comfortable with the workflow
- Add more issues as you go

### 2. Keep It Updated
- Move cards as work progresses
- Update estimates if needed
- Add comments for context

### 3. Use Automation
- Set up GitHub Actions for common tasks
- Auto-assign labels based on title
- Auto-move cards on PR events

### 4. Review Regularly
- Check board in daily standup
- Update in sprint planning
- Archive completed work

### 5. Customize as Needed
- Adjust columns for your workflow
- Add/remove custom fields
- Create views that help your team

---

## Next Steps

1. **Create the project** (5 minutes)
2. **Configure columns and fields** (10 minutes)
3. **Create labels** (5 minutes using script)
4. **Create Sprint 1 issues** (30 minutes)
5. **Assign to team** (5 minutes)
6. **Start Sprint 1!** 🚀

---

## Support Resources

- **GitHub Projects Docs**: https://docs.github.com/en/issues/planning-and-tracking-with-projects
- **GitHub CLI**: https://cli.github.com/
- **GitHub Actions**: https://docs.github.com/en/actions

---

## Troubleshooting

### Can't create project
- Make sure you have admin access to the repository
- Try creating from organization level if repository level doesn't work

### Labels not showing
- Refresh the page
- Check if labels were created in the correct repository

### Issues not appearing in project
- Make sure issues are linked to the project
- Check project filters

### Automation not working
- Verify GitHub Actions are enabled
- Check workflow file syntax
- Review action logs for errors

---

## Project Created! ✅

Once you've completed the setup, you'll have:
- ✅ Organized project board
- ✅ Custom fields for tracking
- ✅ Labels for categorization
- ✅ Sprint 1 issues ready
- ✅ Team assigned and ready to start

**Ready to begin development!** 🎉
