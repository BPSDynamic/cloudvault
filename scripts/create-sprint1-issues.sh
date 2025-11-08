#!/bin/bash

# CloudVault - Sprint 1 Issues Creation Script
# This script creates all issues for Sprint 1

echo "📋 Creating Sprint 1 issues for CloudVault..."
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

echo "Creating Issue 1.1: Create TypeScript Data Model Interfaces"
gh issue create \
  --title "Create TypeScript Data Model Interfaces" \
  --body "Create TypeScript interfaces for all data models used throughout the application.

**Acceptance Criteria:**
- [ ] User interface with all fields defined
- [ ] Folder interface with relationships
- [ ] File interface with metadata fields
- [ ] ShareLink interface for transfers
- [ ] Analytics interface for event tracking
- [ ] FileMetadata interface for S3 metadata
- [ ] Transfer interface for application state
- [ ] All interfaces exported from \`src/types/models.ts\`

**Files to Create:**
- \`src/types/models.ts\`
- \`src/types/index.ts\`

**Estimate:** 3 story points  
**Sprint:** Sprint 1  
**Requirements:** 1.1, 1.2, 1.3, 1.4, 1.5" \
  --label "🔴 Critical,⚙️ Backend,📦 Phase 1: MVP,🔐 Auth"

echo "Creating Issue 1.2: Define Service Interface Contracts"
gh issue create \
  --title "Define Service Interface Contracts" \
  --body "Define TypeScript interfaces for all service layer methods to ensure type safety.

**Acceptance Criteria:**
- [ ] AuthService interface with all methods
- [ ] S3Service interface with upload/download methods
- [ ] DynamoService interface with CRUD operations
- [ ] LambdaService interface with function calls
- [ ] Request/Response types for each method
- [ ] All interfaces documented with JSDoc comments

**Files to Create:**
- \`src/types/services.ts\`

**Estimate:** 2 story points  
**Sprint:** Sprint 1  
**Requirements:** 1.1, 1.2, 1.3, 1.4, 1.5" \
  --label "🔴 Critical,⚙️ Backend,📦 Phase 1: MVP,🔐 Auth"

echo "Creating Issue 1.3: Create Error Response Types"
gh issue create \
  --title "Create Error Response Types" \
  --body "Create standardized error response types and utility functions.

**Acceptance Criteria:**
- [ ] ErrorResponse interface defined
- [ ] Error code enum created
- [ ] Error utility functions (formatError, isError)
- [ ] Success response wrapper type
- [ ] Type guards for error checking

**Files to Create:**
- \`src/types/errors.ts\`
- \`src/utils/errors.ts\`

**Estimate:** 2 story points  
**Sprint:** Sprint 1  
**Requirements:** 18.1, 18.2" \
  --label "🟠 High,⚙️ Backend,📦 Phase 1: MVP"

echo "Creating Issue 1.4: Set Up Utility Functions"
gh issue create \
  --title "Set Up Utility Functions" \
  --body "Create common utility functions used throughout the application.

**Acceptance Criteria:**
- [ ] File size formatting function
- [ ] Date formatting utilities
- [ ] String sanitization functions
- [ ] File type detection helpers
- [ ] URL validation utilities
- [ ] Unit tests for all utilities

**Files to Create:**
- \`src/utils/format.ts\`
- \`src/utils/validation.ts\`
- \`src/utils/helpers.ts\`

**Estimate:** 3 story points  
**Sprint:** Sprint 1" \
  --label "🟡 Medium,🎨 Frontend,📦 Phase 1: MVP"

echo "Creating Issue 2.1: Add MFA Setup Flow"
gh issue create \
  --title "Add MFA Setup Flow" \
  --body "Implement TOTP-based MFA enrollment and verification.

**Acceptance Criteria:**
- [ ] \`setupMFA()\` method in authService
- [ ] \`verifyMFA()\` method for TOTP codes
- [ ] \`disableMFA()\` method
- [ ] QR code generation for authenticator apps
- [ ] Backup codes generation
- [ ] MFA status stored in user profile

**Files to Modify:**
- \`src/lib/authService.ts\`

**Files to Create:**
- \`src/components/auth/MFASetup.tsx\`
- \`src/components/auth/MFAVerification.tsx\`

**Estimate:** 8 story points  
**Sprint:** Sprint 1  
**Requirements:** 2.2" \
  --label "🟠 High,⚙️ Backend,📦 Phase 1: MVP,🔐 Auth"

echo "Creating Issue 2.2: Create MFA UI Components"
gh issue create \
  --title "Create MFA UI Components" \
  --body "Build UI components for MFA enrollment and verification.

**Acceptance Criteria:**
- [ ] MFA setup modal with QR code display
- [ ] TOTP code input component
- [ ] Backup codes display and download
- [ ] MFA status indicator in profile
- [ ] Enable/disable MFA toggle
- [ ] Responsive design for mobile

**Files to Create:**
- \`src/components/auth/MFASetup.tsx\`
- \`src/components/auth/MFAVerification.tsx\`
- \`src/components/auth/MFAStatus.tsx\`

**Estimate:** 5 story points  
**Sprint:** Sprint 1  
**Requirements:** 2.2" \
  --label "🟠 High,🎨 Frontend,📦 Phase 1: MVP,🔐 Auth"

echo "Creating Issue 2.3: Implement Token Refresh Mechanism"
gh issue create \
  --title "Implement Token Refresh Mechanism" \
  --body "Add automatic token refresh to maintain user sessions.

**Acceptance Criteria:**
- [ ] Token refresh before expiration
- [ ] Refresh token storage in secure cookie
- [ ] Automatic retry on 401 errors
- [ ] Session timeout notification
- [ ] Logout on refresh failure

**Files to Modify:**
- \`src/lib/authService.ts\`
- \`src/lib/amplify.ts\`

**Estimate:** 3 story points  
**Sprint:** Sprint 1  
**Requirements:** 2.3, 2.4" \
  --label "🔴 Critical,⚙️ Backend,📦 Phase 1: MVP,🔐 Auth"

echo "Creating Issue 2.4: Add Session Persistence"
gh issue create \
  --title "Add Session Persistence" \
  --body "Implement session persistence across browser tabs and windows.

**Acceptance Criteria:**
- [ ] Session state synced across tabs
- [ ] LocalStorage for session data
- [ ] BroadcastChannel for cross-tab communication
- [ ] Session restoration on page reload
- [ ] Logout synced across all tabs

**Files to Create:**
- \`src/hooks/useSessionSync.ts\`

**Estimate:** 3 story points  
**Sprint:** Sprint 1  
**Requirements:** 2.3, 2.4" \
  --label "🟡 Medium,⚙️ Backend,📦 Phase 1: MVP,🔐 Auth"

echo "Creating Issue 2.5: Enhance Auth Error Handling"
gh issue create \
  --title "Enhance Auth Error Handling" \
  --body "Improve error handling for authentication flows with specific error codes.

**Acceptance Criteria:**
- [ ] Error codes for each auth failure type
- [ ] User-friendly error messages
- [ ] Retry logic for network errors
- [ ] Error logging to CloudWatch
- [ ] Toast notifications for errors

**Files to Modify:**
- \`src/lib/authService.ts\`

**Files to Create:**
- \`src/types/authErrors.ts\`

**Estimate:** 4 story points  
**Sprint:** Sprint 1  
**Requirements:** 18.1, 18.2" \
  --label "🟠 High,⚙️ Backend,📦 Phase 1: MVP,🔐 Auth"

echo "Creating Issue ENV.1: Set up AWS Development Environment"
gh issue create \
  --title "Set up AWS Development Environment" \
  --body "Configure AWS account and services for development.

**Acceptance Criteria:**
- [ ] AWS account access verified
- [ ] IAM users created for team
- [ ] AWS CLI configured
- [ ] Cognito User Pool created
- [ ] S3 bucket created
- [ ] DynamoDB tables created
- [ ] CloudWatch logging enabled

**Estimate:** 5 story points  
**Sprint:** Sprint 1" \
  --label "🔴 Critical,🔧 DevOps,📦 Phase 1: MVP"

echo "Creating Issue ENV.2: Configure Amplify Gen 2 Sandbox"
gh issue create \
  --title "Configure Amplify Gen 2 Sandbox" \
  --body "Set up Amplify Gen 2 sandbox for local development.

**Acceptance Criteria:**
- [ ] Amplify CLI installed
- [ ] Amplify initialized in project
- [ ] Sandbox deployed successfully
- [ ] \`amplify_outputs.json\` generated
- [ ] Backend resources verified in AWS
- [ ] Team members can access sandbox

**Estimate:** 3 story points  
**Sprint:** Sprint 1" \
  --label "🔴 Critical,🔧 DevOps,📦 Phase 1: MVP"

echo "Creating Issue ENV.3: Set up CI/CD Pipeline (Basic)"
gh issue create \
  --title "Set up CI/CD Pipeline (Basic)" \
  --body "Configure basic CI/CD pipeline for automated testing and deployment.

**Acceptance Criteria:**
- [ ] GitHub Actions workflow created
- [ ] Automated tests run on PR
- [ ] Linting checks on commit
- [ ] Build verification on push
- [ ] Deploy to staging on merge to main
- [ ] Slack/email notifications on failure

**Files to Create:**
- \`.github/workflows/ci.yml\`
- \`.github/workflows/deploy-staging.yml\`

**Estimate:** 4 story points  
**Sprint:** Sprint 1" \
  --label "🟠 High,🔧 DevOps,📦 Phase 1: MVP"

echo ""
echo "✅ All Sprint 1 issues created successfully!"
echo ""
echo "Total: 12 issues, 45 story points"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/BPSDynamic/cloudvault/issues to verify"
echo "2. Add issues to your GitHub Project"
echo "3. Assign issues to team members"
echo "4. Start Sprint 1!"
