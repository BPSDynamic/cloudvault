# CloudVault - Detailed Tickets Breakdown

This document breaks down each major task into smaller, actionable tickets suitable for project management tools (Jira, GitHub Issues, etc.).

---

## Task 1: Set up project structure and core interfaces

### Ticket 1.1: Create TypeScript Data Model Interfaces
**Priority**: Critical  
**Estimate**: 4 hours  
**Assignee**: Backend Dev

**Description**:
Create TypeScript interfaces for all data models used throughout the application.

**Acceptance Criteria**:
- [ ] User interface with all fields defined
- [ ] Folder interface with relationships
- [ ] File interface with metadata fields
- [ ] ShareLink interface for transfers
- [ ] Analytics interface for event tracking
- [ ] FileMetadata interface for S3 metadata
- [ ] Transfer interface for application state
- [ ] All interfaces exported from `src/types/models.ts`

**Files to Create**:
- `src/types/models.ts`
- `src/types/index.ts`

---

### Ticket 1.2: Define Service Interface Contracts
**Priority**: Critical  
**Estimate**: 3 hours  
**Assignee**: Backend Dev

**Description**:
Define TypeScript interfaces for all service layer methods to ensure type safety.

**Acceptance Criteria**:
- [ ] AuthService interface with all methods
- [ ] S3Service interface with upload/download methods
- [ ] DynamoService interface with CRUD operations
- [ ] LambdaService interface with function calls
- [ ] Request/Response types for each method
- [ ] All interfaces documented with JSDoc comments

**Files to Create**:
- `src/types/services.ts`

---

### Ticket 1.3: Create Error Response Types
**Priority**: High  
**Estimate**: 2 hours  
**Assignee**: Backend Dev

**Description**:
Create standardized error response types and utility functions.

**Acceptance Criteria**:
- [ ] ErrorResponse interface defined
- [ ] Error code enum created
- [ ] Error utility functions (formatError, isError)
- [ ] Success response wrapper type
- [ ] Type guards for error checking

**Files to Create**:
- `src/types/errors.ts`
- `src/utils/errors.ts`

---

### Ticket 1.4: Set Up Utility Functions
**Priority**: Medium  
**Estimate**: 3 hours  
**Assignee**: Frontend Dev

**Description**:
Create common utility functions used throughout the application.

**Acceptance Criteria**:
- [ ] File size formatting function
- [ ] Date formatting utilities
- [ ] String sanitization functions
- [ ] File type detection helpers
- [ ] URL validation utilities
- [ ] Unit tests for all utilities

**Files to Create**:
- `src/utils/format.ts`
- `src/utils/validation.ts`
- `src/utils/helpers.ts`

---

## Task 2: Implement authentication service enhancements

### Ticket 2.1: Add MFA Setup Flow
**Priority**: High  
**Estimate**: 8 hours  
**Assignee**: Backend Dev

**Description**:
Implement TOTP-based MFA enrollment and verification.

**Acceptance Criteria**:
- [ ] `setupMFA()` method in authService
- [ ] `verifyMFA()` method for TOTP codes
- [ ] `disableMFA()` method
- [ ] QR code generation for authenticator apps
- [ ] Backup codes generation
- [ ] MFA status stored in user profile

**Files to Modify**:
- `src/lib/authService.ts`

**Files to Create**:
- `src/components/auth/MFASetup.tsx`
- `src/components/auth/MFAVerification.tsx`

---

### Ticket 2.2: Create MFA UI Components
**Priority**: High  
**Estimate**: 6 hours  
**Assignee**: Frontend Dev

**Description**:
Build UI components for MFA enrollment and verification.

**Acceptance Criteria**:
- [ ] MFA setup modal with QR code display
- [ ] TOTP code input component
- [ ] Backup codes display and download
- [ ] MFA status indicator in profile
- [ ] Enable/disable MFA toggle
- [ ] Responsive design for mobile

**Files to Create**:
- `src/components/auth/MFASetup.tsx`
- `src/components/auth/MFAVerification.tsx`
- `src/components/auth/MFAStatus.tsx`

---

### Ticket 2.3: Implement Token Refresh Mechanism
**Priority**: Critical  
**Estimate**: 4 hours  
**Assignee**: Backend Dev

**Description**:
Add automatic token refresh to maintain user sessions.

**Acceptance Criteria**:
- [ ] Token refresh before expiration
- [ ] Refresh token storage in secure cookie
- [ ] Automatic retry on 401 errors
- [ ] Session timeout notification
- [ ] Logout on refresh failure

**Files to Modify**:
- `src/lib/authService.ts`
- `src/lib/amplify.ts`

---

### Ticket 2.4: Add Session Persistence
**Priority**: Medium  
**Estimate**: 3 hours  
**Assignee**: Backend Dev

**Description**:
Implement session persistence across browser tabs and windows.

**Acceptance Criteria**:
- [ ] Session state synced across tabs
- [ ] LocalStorage for session data
- [ ] BroadcastChannel for cross-tab communication
- [ ] Session restoration on page reload
- [ ] Logout synced across all tabs

**Files to Create**:
- `src/hooks/useSessionSync.ts`

---

### Ticket 2.5: Enhance Auth Error Handling
**Priority**: High  
**Estimate**: 4 hours  
**Assignee**: Backend Dev

**Description**:
Improve error handling for authentication flows with specific error codes.

**Acceptance Criteria**:
- [ ] Error codes for each auth failure type
- [ ] User-friendly error messages
- [ ] Retry logic for network errors
- [ ] Error logging to CloudWatch
- [ ] Toast notifications for errors

**Files to Modify**:
- `src/lib/authService.ts`

**Files to Create**:
- `src/types/authErrors.ts`

---

## Task 3: Enhance file upload functionality

### Ticket 3.1: Implement Multipart Upload
**Priority**: Critical  
**Estimate**: 10 hours  
**Assignee**: Backend Dev

**Description**:
Add multipart upload support for files larger than 100MB.

**Acceptance Criteria**:
- [ ] Detect files > 100MB and use multipart
- [ ] Split files into 5MB chunks
- [ ] Upload chunks in parallel (max 4 concurrent)
- [ ] Track progress per chunk
- [ ] Handle chunk upload failures with retry
- [ ] Complete multipart upload on success

**Files to Modify**:
- `src/lib/s3Service.ts`

---

### Ticket 3.2: Add Pause/Resume Upload
**Priority**: Medium  
**Estimate**: 6 hours  
**Assignee**: Backend Dev

**Description**:
Allow users to pause and resume file uploads.

**Acceptance Criteria**:
- [ ] Pause button in upload progress UI
- [ ] Store upload state in localStorage
- [ ] Resume from last completed chunk
- [ ] Clear paused uploads after 24 hours
- [ ] Show paused uploads on page reload

**Files to Modify**:
- `src/lib/s3Service.ts`
- `src/components/upload/FileUpload.tsx`

---

### Ticket 3.3: Add Upload Speed and ETA
**Priority**: Low  
**Estimate**: 3 hours  
**Assignee**: Frontend Dev

**Description**:
Display upload speed and estimated time remaining.

**Acceptance Criteria**:
- [ ] Calculate upload speed (MB/s)
- [ ] Calculate ETA based on remaining bytes
- [ ] Display speed and ETA in upload UI
- [ ] Update every second
- [ ] Format speed (KB/s, MB/s)

**Files to Modify**:
- `src/components/upload/FileUpload.tsx`

---

### Ticket 3.4: Implement File Type Validation
**Priority**: High  
**Estimate**: 4 hours  
**Assignee**: Backend Dev

**Description**:
Validate file types against folder restrictions before upload.

**Acceptance Criteria**:
- [ ] Check file MIME type
- [ ] Validate against folder allowed types
- [ ] Show error for invalid file types
- [ ] Display allowed types in error message
- [ ] Prevent upload of invalid files

**Files to Modify**:
- `src/lib/s3Service.ts`

**Files to Create**:
- `src/utils/fileValidation.ts`

---

### Ticket 3.5: Add File Size Validation
**Priority**: High  
**Estimate**: 2 hours  
**Assignee**: Backend Dev

**Description**:
Validate file sizes before upload to prevent quota exceeded errors.

**Acceptance Criteria**:
- [ ] Check file size against user quota
- [ ] Check file size against 2GB transfer limit
- [ ] Show error for oversized files
- [ ] Display available storage in error
- [ ] Suggest storage upgrade if needed

**Files to Modify**:
- `src/lib/s3Service.ts`

---

### Ticket 3.6: Create Thumbnail Generation
**Priority**: Low  
**Estimate**: 6 hours  
**Assignee**: Backend Dev

**Description**:
Generate thumbnails for image files on upload.

**Acceptance Criteria**:
- [ ] Detect image file types
- [ ] Generate 200x200px thumbnails
- [ ] Store thumbnails in S3
- [ ] Link thumbnail to file metadata
- [ ] Display thumbnails in file browser

**Files to Create**:
- `amplify/functions/fileProcessor/thumbnail.ts`

---

### Ticket 3.7: Enhance Upload Progress Tracking
**Priority**: Medium  
**Estimate**: 4 hours  
**Assignee**: Frontend Dev

**Description**:
Improve upload progress UI for batch uploads.

**Acceptance Criteria**:
- [ ] Per-file progress bars
- [ ] Overall progress indicator
- [ ] Upload queue display
- [ ] Cancel individual uploads
- [ ] Retry failed uploads

**Files to Modify**:
- `src/components/upload/FileUpload.tsx`
- `src/components/upload/UploadDialog.tsx`

---

## Task 4: Implement folder management system

### Ticket 4.1: Create Folder CRUD in DynamoDB
**Priority**: Critical  
**Estimate**: 6 hours  
**Assignee**: Backend Dev

**Description**:
Implement folder create, read, update, delete operations in DynamoDB.

**Acceptance Criteria**:
- [ ] `createFolder()` method
- [ ] `getFolder()` method
- [ ] `updateFolder()` method
- [ ] `deleteFolder()` method with cascade
- [ ] Folder metadata validation
- [ ] Error handling for all operations

**Files to Modify**:
- `src/lib/dynamoService.ts`

---

### Ticket 4.2: Create Folder CRUD in S3
**Priority**: Critical  
**Estimate**: 6 hours  
**Assignee**: Backend Dev

**Description**:
Implement folder structure in S3 with placeholder files.

**Acceptance Criteria**:
- [ ] Create folder with `.folder_placeholder` file
- [ ] Store folder metadata in `.metadata/folders/`
- [ ] List folders by prefix
- [ ] Delete folder and all contents
- [ ] Handle nested folder structures

**Files to Modify**:
- `src/lib/s3Service.ts`

---

### Ticket 4.3: Build Folder Creation UI
**Priority**: High  
**Estimate**: 4 hours  
**Assignee**: Frontend Dev

**Description**:
Create UI for folder creation with file type restrictions.

**Acceptance Criteria**:
- [ ] Folder creation modal
- [ ] Folder name input with validation
- [ ] File type selection checkboxes
- [ ] Parent folder selection
- [ ] Create button with loading state
- [ ] Success/error notifications

**Files to Modify**:
- `src/pages/Dashboard.tsx`
- `src/pages/Folders.tsx`

---

### Ticket 4.4: Implement Breadcrumb Navigation
**Priority**: High  
**Estimate**: 4 hours  
**Assignee**: Frontend Dev

**Description**:
Build breadcrumb navigation for folder hierarchy.

**Acceptance Criteria**:
- [ ] Display folder path as breadcrumbs
- [ ] Click breadcrumb to navigate
- [ ] Highlight current folder
- [ ] Show "Root" for top level
- [ ] Responsive design for mobile

**Files to Modify**:
- `src/pages/Dashboard.tsx`

---

### Ticket 4.5: Create Folder Tree Sidebar
**Priority**: Medium  
**Estimate**: 6 hours  
**Assignee**: Frontend Dev

**Description**:
Build collapsible folder tree in sidebar.

**Acceptance Criteria**:
- [ ] Display folder hierarchy
- [ ] Expand/collapse folders
- [ ] Click to navigate
- [ ] Highlight current folder
- [ ] Show folder icons
- [ ] Drag-and-drop to move files (future)

**Files to Modify**:
- `src/components/dashboard/AppSidebar.tsx`

---

### Ticket 4.6: Add Folder Update Functionality
**Priority**: Medium  
**Estimate**: 4 hours  
**Assignee**: Backend Dev

**Description**:
Allow users to rename folders and update restrictions.

**Acceptance Criteria**:
- [ ] Rename folder modal
- [ ] Update allowed file types
- [ ] Update confidentiality level
- [ ] Sync changes to S3 and DynamoDB
- [ ] Show success notification

**Files to Modify**:
- `src/lib/dynamoService.ts`
- `src/lib/s3Service.ts`
- `src/pages/Folders.tsx`

---

### Ticket 4.7: Implement Folder Deletion with Cascade
**Priority**: High  
**Estimate**: 5 hours  
**Assignee**: Backend Dev

**Description**:
Delete folders and all contained files/subfolders.

**Acceptance Criteria**:
- [ ] Confirm deletion dialog
- [ ] Delete all files in folder
- [ ] Delete all subfolders recursively
- [ ] Remove from S3 and DynamoDB
- [ ] Move to trash instead of permanent delete
- [ ] Show deletion progress

**Files to Modify**:
- `src/lib/dynamoService.ts`
- `src/lib/s3Service.ts`
- `src/pages/Folders.tsx`

---

## Task 5: Build temporary file sharing system

### Ticket 5.1: Create Transfer Creation UI
**Priority**: Critical  
**Estimate**: 8 hours  
**Assignee**: Frontend Dev

**Description**:
Build UI for creating file transfers (WeTransfer-style).

**Acceptance Criteria**:
- [ ] File selection with drag-and-drop
- [ ] Multiple file support
- [ ] Recipient email inputs (add/remove)
- [ ] Optional message textarea
- [ ] Expiration date selector (1-30 days)
- [ ] Upload progress display
- [ ] Share button with loading state

**Files to Modify**:
- `src/pages/ShareFiles.tsx`

---

### Ticket 5.2: Implement Share Link Generation
**Priority**: Critical  
**Estimate**: 6 hours  
**Assignee**: Backend Dev

**Description**:
Generate unique share links with expiration.

**Acceptance Criteria**:
- [ ] Generate UUID token for share link
- [ ] Create signed S3 URLs for files
- [ ] Store transfer metadata in S3
- [ ] Set expiration date
- [ ] Return shareable URL
- [ ] Store sender information

**Files to Modify**:
- `src/lib/s3Service.ts`

**Files to Create**:
- `src/utils/shareLink.ts`

---

### Ticket 5.3: Build Download Page for Shared Links
**Priority**: High  
**Estimate**: 6 hours  
**Assignee**: Frontend Dev

**Description**:
Create public download page for share links.

**Acceptance Criteria**:
- [ ] Public route for `/share/:token`
- [ ] Display sender information
- [ ] Show file list with sizes
- [ ] Optional message display
- [ ] Download individual files
- [ ] Download all as ZIP
- [ ] Show expiration date
- [ ] Track download count

**Files to Create**:
- `src/pages/PublicShare.tsx`

---

### Ticket 5.4: Implement Download Tracking
**Priority**: High  
**Estimate**: 4 hours  
**Assignee**: Backend Dev

**Description**:
Track downloads for shared transfers.

**Acceptance Criteria**:
- [ ] Increment download counter
- [ ] Store download timestamp
- [ ] Track IP address (anonymized)
- [ ] Send notification to sender
- [ ] Enforce download limits if set
- [ ] Log to analytics

**Files to Modify**:
- `src/lib/s3Service.ts`
- `src/lib/lambdaService.ts`

---

### Ticket 5.5: Create Transfer Management UI
**Priority**: High  
**Estimate**: 6 hours  
**Assignee**: Frontend Dev

**Description**:
Build interface to manage all transfers.

**Acceptance Criteria**:
- [ ] List all transfers (active/expired/all)
- [ ] Display transfer details (files, recipients, downloads)
- [ ] Copy share link button
- [ ] Delete transfer button
- [ ] Filter by status
- [ ] Search transfers
- [ ] Show expiration countdown

**Files to Modify**:
- `src/pages/SharedFiles.tsx`

---

### Ticket 5.6: Add Email Notifications for Transfers
**Priority**: Medium  
**Estimate**: 5 hours  
**Assignee**: Backend Dev

**Description**:
Send email notifications to recipients when files are shared.

**Acceptance Criteria**:
- [ ] Email template for file sharing
- [ ] Include sender name and message
- [ ] List shared files
- [ ] Add download link
- [ ] Show expiration date
- [ ] Send via AWS SES

**Files to Create**:
- `amplify/functions/notificationService/templates/shareEmail.ts`

---

## Task 6: Implement persistent storage features

### Ticket 6.1: Build File Browser Grid View
**Priority**: High  
**Estimate**: 6 hours  
**Assignee**: Frontend Dev

**Description**:
Create grid view for file browsing.

**Acceptance Criteria**:
- [ ] Responsive grid layout
- [ ] File cards with icons
- [ ] File name, size, date display
- [ ] Hover actions (download, share, delete)
- [ ] Selection checkboxes
- [ ] Thumbnail display for images
- [ ] Loading skeletons

**Files to Modify**:
- `src/pages/Dashboard.tsx`
- `src/components/upload/FileManager.tsx`

---

### Ticket 6.2: Build File Browser List View
**Priority**: High  
**Estimate**: 4 hours  
**Assignee**: Frontend Dev

**Description**:
Create list view for file browsing.

**Acceptance Criteria**:
- [ ] Table layout with columns
- [ ] Sortable columns (name, size, date, type)
- [ ] Row hover effects
- [ ] Action menu per row
- [ ] Selection checkboxes
- [ ] Compact design for many files

**Files to Modify**:
- `src/pages/Dashboard.tsx`
- `src/components/upload/FileManager.tsx`

---

### Ticket 6.3: Add View Mode Toggle
**Priority**: Low  
**Estimate**: 2 hours  
**Assignee**: Frontend Dev

**Description**:
Add toggle between grid and list views.

**Acceptance Criteria**:
- [ ] Toggle button in toolbar
- [ ] Save preference to localStorage
- [ ] Smooth transition between views
- [ ] Icons for grid/list modes
- [ ] Keyboard shortcut (optional)

**Files to Modify**:
- `src/pages/Dashboard.tsx`

---

### Ticket 6.4: Implement File Download
**Priority**: Critical  
**Estimate**: 4 hours  
**Assignee**: Backend Dev

**Description**:
Add file download functionality with signed URLs.

**Acceptance Criteria**:
- [ ] Generate signed S3 URL (24hr expiration)
- [ ] Trigger browser download
- [ ] Track download event
- [ ] Handle download errors
- [ ] Show download progress (optional)

**Files to Modify**:
- `src/lib/s3Service.ts`
- `src/components/upload/FileManager.tsx`

---

### Ticket 6.5: Add File Rename
**Priority**: Medium  
**Estimate**: 4 hours  
**Assignee**: Backend Dev

**Description**:
Allow users to rename files.

**Acceptance Criteria**:
- [ ] Rename modal with input
- [ ] Validate new filename
- [ ] Update S3 object key
- [ ] Update DynamoDB metadata
- [ ] Show success notification
- [ ] Handle rename errors

**Files to Modify**:
- `src/lib/s3Service.ts`
- `src/lib/dynamoService.ts`
- `src/components/upload/FileManager.tsx`

---

### Ticket 6.6: Implement File Move Between Folders
**Priority**: Medium  
**Estimate**: 5 hours  
**Assignee**: Backend Dev

**Description**:
Allow users to move files between folders.

**Acceptance Criteria**:
- [ ] Move file modal with folder selector
- [ ] Copy S3 object to new location
- [ ] Delete original S3 object
- [ ] Update DynamoDB folder reference
- [ ] Show move progress
- [ ] Handle move errors

**Files to Modify**:
- `src/lib/s3Service.ts`
- `src/lib/dynamoService.ts`
- `src/components/upload/FileManager.tsx`

---

### Ticket 6.7: Build Search Functionality
**Priority**: High  
**Estimate**: 6 hours  
**Assignee**: Frontend Dev

**Description**:
Implement real-time file search.

**Acceptance Criteria**:
- [ ] Search input in toolbar
- [ ] Real-time filtering as user types
- [ ] Search across file names
- [ ] Highlight matching text
- [ ] Clear search button
- [ ] Show search results count
- [ ] Debounce search input (300ms)

**Files to Modify**:
- `src/pages/Dashboard.tsx`

---

## Continue with remaining tasks...

*Note: This is a sample of the ticket breakdown. The full document would continue with similar detailed breakdowns for Tasks 7-23. Each ticket includes:*
- Priority level
- Time estimate
- Assignee role
- Description
- Acceptance criteria
- Files to create/modify

Would you like me to continue with the remaining tasks, or shall I proceed to create the other planning documents?
