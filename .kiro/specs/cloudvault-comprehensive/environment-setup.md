# CloudVault - Environment Setup Checklist

This checklist ensures all developers have the necessary tools and configurations to start working on CloudVault.

---

## Prerequisites

### Required Software

- [ ] **Node.js** (v18.0.0 or higher)
  ```bash
  node --version  # Should be >= 18.0.0
  ```
  - Download: https://nodejs.org/

- [ ] **npm** (v9.0.0 or higher)
  ```bash
  npm --version  # Should be >= 9.0.0
  ```

- [ ] **Git** (v2.30.0 or higher)
  ```bash
  git --version
  ```
  - Download: https://git-scm.com/

- [ ] **AWS CLI** (v2.0.0 or higher)
  ```bash
  aws --version
  ```
  - Install: https://aws.amazon.com/cli/

- [ ] **Code Editor** (VS Code recommended)
  - Download: https://code.visualstudio.com/

---

## AWS Account Setup

### 1. AWS Account Access

- [ ] Request AWS account access from team lead
- [ ] Receive IAM user credentials
- [ ] Set up MFA for AWS account
- [ ] Verify access to AWS Console

### 2. Configure AWS CLI

```bash
# Configure AWS credentials
aws configure

# Enter when prompted:
# AWS Access Key ID: [your-access-key]
# AWS Secret Access Key: [your-secret-key]
# Default region name: us-east-1 (or your preferred region)
# Default output format: json
```

- [ ] AWS CLI configured
- [ ] Test AWS access:
  ```bash
  aws sts get-caller-identity
  ```

### 3. AWS Services Access

Verify you have access to:
- [ ] AWS Amplify
- [ ] Amazon S3
- [ ] Amazon DynamoDB
- [ ] AWS Lambda
- [ ] Amazon Cognito
- [ ] Amazon SES (for email notifications)
- [ ] AWS CloudWatch

---

## Project Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/BPSDynamic/cloudvault.git

# Navigate to project directory
cd cloudvault

# Verify you're on main branch
git branch
```

- [ ] Repository cloned
- [ ] On main branch

### 2. Install Dependencies

```bash
# Install project dependencies
npm install

# Verify installation
npm list --depth=0
```

- [ ] Dependencies installed
- [ ] No critical vulnerabilities

### 3. Install Amplify CLI

```bash
# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Verify installation
amplify --version
```

- [ ] Amplify CLI installed
- [ ] Version 12.0.0 or higher

---

## Amplify Configuration

### 1. Initialize Amplify

```bash
# Initialize Amplify in the project
amplify init

# Follow prompts:
# ? Enter a name for the environment: dev
# ? Choose your default editor: [Your editor]
# ? Select the authentication method: AWS profile
# ? Please choose the profile you want to use: default
```

- [ ] Amplify initialized
- [ ] Environment created (dev)

### 2. Deploy Backend (Sandbox)

```bash
# Start Amplify sandbox for local development
npx ampx sandbox

# This will:
# - Deploy backend resources to AWS
# - Generate amplify_outputs.json
# - Watch for changes
```

- [ ] Sandbox deployed
- [ ] `amplify_outputs.json` generated
- [ ] Backend resources created in AWS

### 3. Verify Backend Resources

Check AWS Console for:
- [ ] Cognito User Pool created
- [ ] S3 Bucket created
- [ ] DynamoDB tables created
- [ ] Lambda functions deployed (if any)

---

## Development Environment

### 1. Environment Variables

Create `.env.local` file in project root:

```bash
# Copy example env file
cp .env.example .env.local
```

Add the following variables:

```env
# AWS Configuration
VITE_APP_REGION=us-east-1
VITE_APP_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_APP_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_APP_IDENTITY_POOL_ID=us-east-1:XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
VITE_APP_S3_BUCKET=cloudvault-storage-XXXXX
VITE_APP_API_GATEWAY_URL=https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/prod

# Optional: Development settings
VITE_APP_ENV=development
VITE_APP_DEBUG=true
```

- [ ] `.env.local` created
- [ ] All variables configured
- [ ] File added to `.gitignore`

### 2. VS Code Extensions (Recommended)

Install these extensions:

- [ ] **ESLint** (dbaeumer.vscode-eslint)
- [ ] **Prettier** (esbenp.prettier-vscode)
- [ ] **TypeScript** (ms-vscode.vscode-typescript-next)
- [ ] **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- [ ] **AWS Toolkit** (amazonwebservices.aws-toolkit-vscode)
- [ ] **GitLens** (eamodio.gitlens)

### 3. VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

- [ ] VS Code settings configured
- [ ] Format on save enabled
- [ ] ESLint auto-fix enabled

---

## Start Development Server

### 1. Run Development Server

```bash
# Start Vite development server
npm run dev

# Server should start at http://localhost:8080
```

- [ ] Development server running
- [ ] No compilation errors
- [ ] Can access http://localhost:8080

### 2. Verify Application

Open browser and verify:
- [ ] Application loads
- [ ] No console errors
- [ ] Can see login/signup page
- [ ] Tailwind CSS styles applied

### 3. Test Authentication

- [ ] Can create new account
- [ ] Receive verification email
- [ ] Can verify email
- [ ] Can log in
- [ ] Can log out

---

## Git Workflow Setup

### 1. Configure Git

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Enable credential caching (optional)
git config --global credential.helper cache
```

- [ ] Git configured
- [ ] Name and email set

### 2. Branch Naming Convention

Use this format for feature branches:
```
feature/ticket-number-short-description
bugfix/ticket-number-short-description
hotfix/ticket-number-short-description
```

Examples:
- `feature/1.1-data-model-interfaces`
- `bugfix/2.3-token-refresh-error`
- `hotfix/critical-auth-issue`

### 3. Commit Message Convention

Follow Conventional Commits:
```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(auth): add MFA setup flow

Implement TOTP-based MFA enrollment with QR code generation
and backup codes.

Closes #2.1
```

- [ ] Commit convention understood
- [ ] Example commits reviewed

---

## Testing Setup

### 1. Install Testing Dependencies

```bash
# Install Jest and React Testing Library
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom

# Install TypeScript types
npm install --save-dev @types/jest
```

- [ ] Testing dependencies installed

### 2. Configure Jest

Create `jest.config.js`:

```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
};
```

- [ ] Jest configured

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

- [ ] Tests run successfully
- [ ] No failing tests

---

## Database Setup

### 1. Verify DynamoDB Tables

Check AWS Console → DynamoDB:
- [ ] User table exists
- [ ] Folder table exists
- [ ] File table exists
- [ ] ShareLink table exists
- [ ] Analytics table exists

### 2. Seed Test Data (Optional)

```bash
# Run seed script (if available)
npm run seed

# Or manually create test data through the UI
```

- [ ] Test data created (optional)

---

## S3 Bucket Setup

### 1. Verify S3 Bucket

Check AWS Console → S3:
- [ ] CloudVault storage bucket exists
- [ ] Bucket has correct permissions
- [ ] CORS configured
- [ ] Encryption enabled

### 2. Test File Upload

- [ ] Can upload file through UI
- [ ] File appears in S3 bucket
- [ ] Can download file
- [ ] Can delete file

---

## Cognito Setup

### 1. Verify User Pool

Check AWS Console → Cognito:
- [ ] User pool created
- [ ] App client configured
- [ ] Email verification enabled
- [ ] Password policy set

### 2. Test Authentication

- [ ] Can sign up new user
- [ ] Receive verification email
- [ ] Can verify email with code
- [ ] Can sign in
- [ ] Can reset password

---

## Lambda Functions Setup

### 1. Verify Lambda Functions

Check AWS Console → Lambda:
- [ ] fileProcessor function exists
- [ ] notificationService function exists
- [ ] analyticsService function exists
- [ ] backupService function exists
- [ ] folderService function exists
- [ ] fileService function exists

### 2. Test Lambda Functions

```bash
# Test a Lambda function
aws lambda invoke \
  --function-name fileProcessor \
  --payload '{"test": true}' \
  response.json

# Check response
cat response.json
```

- [ ] Lambda functions responding
- [ ] No errors in CloudWatch logs

---

## Monitoring Setup

### 1. CloudWatch Access

- [ ] Can access CloudWatch console
- [ ] Can view logs for Lambda functions
- [ ] Can view metrics for API Gateway

### 2. Set Up Alerts (Optional)

- [ ] Create alarm for error rates
- [ ] Create alarm for high latency
- [ ] Configure SNS topic for alerts

---

## Documentation Access

### 1. Project Documentation

- [ ] Read README.md
- [ ] Review requirements.md
- [ ] Review design.md
- [ ] Review tasks.md
- [ ] Review roadmap.md

### 2. AWS Documentation

Bookmark these resources:
- [ ] AWS Amplify Gen 2 Docs
- [ ] AWS S3 Documentation
- [ ] AWS DynamoDB Documentation
- [ ] AWS Lambda Documentation
- [ ] AWS Cognito Documentation

---

## Team Communication

### 1. Communication Channels

- [ ] Join team Slack/Discord channel
- [ ] Add to team email list
- [ ] Access to project management tool (Jira/GitHub Projects)
- [ ] Calendar invites for standups and meetings

### 2. Meeting Schedule

- [ ] Daily standup time confirmed
- [ ] Sprint planning schedule
- [ ] Sprint review schedule
- [ ] Retrospective schedule

---

## Troubleshooting

### Common Issues

#### Issue: `amplify_outputs.json` not found
**Solution**:
```bash
npx ampx sandbox
# Wait for deployment to complete
```

#### Issue: AWS credentials not working
**Solution**:
```bash
aws configure
# Re-enter credentials
aws sts get-caller-identity
```

#### Issue: Port 8080 already in use
**Solution**:
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
# Or change port in vite.config.ts
```

#### Issue: Module not found errors
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue: TypeScript errors
**Solution**:
```bash
# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## Verification Checklist

Before starting development, verify:

### Environment
- [ ] Node.js and npm installed
- [ ] AWS CLI configured
- [ ] Amplify CLI installed
- [ ] Repository cloned
- [ ] Dependencies installed

### AWS Resources
- [ ] Amplify sandbox deployed
- [ ] Cognito user pool created
- [ ] S3 bucket created
- [ ] DynamoDB tables created
- [ ] Lambda functions deployed

### Development
- [ ] Development server runs
- [ ] Application loads in browser
- [ ] Can authenticate
- [ ] Can upload files
- [ ] No console errors

### Tools
- [ ] VS Code configured
- [ ] Extensions installed
- [ ] Git configured
- [ ] Testing framework set up

### Team
- [ ] Added to communication channels
- [ ] Meeting schedule confirmed
- [ ] Project board access
- [ ] Documentation reviewed

---

## Next Steps

Once setup is complete:

1. **Review Sprint 1 tasks** in sprint-plan.md
2. **Pick your first ticket** from the project board
3. **Create feature branch** following naming convention
4. **Start coding!** 🚀

---

## Getting Help

If you encounter issues:

1. **Check documentation** in `.kiro/specs/cloudvault-comprehensive/`
2. **Search existing issues** on GitHub
3. **Ask in team channel** on Slack/Discord
4. **Create issue** if problem persists
5. **Pair with teammate** for complex issues

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Amplify
npx ampx sandbox         # Start Amplify sandbox
npx ampx sandbox delete  # Delete sandbox resources
amplify status           # Check Amplify status

# Git
git status               # Check status
git branch               # List branches
git checkout -b feature/ticket-name  # Create new branch
git add .                # Stage changes
git commit -m "message"  # Commit changes
git push origin branch-name  # Push to remote

# Testing
npm test                 # Run tests
npm test -- --watch      # Run tests in watch mode
npm test -- --coverage   # Run tests with coverage

# AWS
aws s3 ls                # List S3 buckets
aws dynamodb list-tables # List DynamoDB tables
aws lambda list-functions # List Lambda functions
aws cognito-idp list-user-pools --max-results 10  # List Cognito pools
```

---

## Environment Setup Complete! ✅

You're now ready to start developing CloudVault. Good luck! 🎉
