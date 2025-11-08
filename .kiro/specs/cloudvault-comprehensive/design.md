# CloudVault - Design Document

## Overview

CloudVault is a hybrid cloud storage and file transfer platform that combines persistent storage capabilities (Dropbox-style) with temporary file sharing features (WeTransfer-style). The system is built on AWS infrastructure using Amplify Gen 2, providing a scalable, secure, and performant solution for enterprise file management.

### Key Design Principles

1. **Dual-Mode Operation**: Support both persistent storage and temporary transfers in a unified interface
2. **Security First**: Implement multiple layers of security including encryption, access control, and audit logging
3. **Scalability**: Design for horizontal scaling to support thousands of concurrent users
4. **User Experience**: Provide intuitive interfaces with real-time feedback and progress tracking
5. **Reliability**: Implement fallback mechanisms and error recovery for robust operation

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                           │
│  React 18 + TypeScript + Vite + Shadcn/ui + Tailwind CSS       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS Amplify Gen 2                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Cognito    │  │  API Gateway │  │   AppSync    │         │
│  │     Auth     │  │   REST API   │  │   GraphQL    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Lambda     │  │  DynamoDB    │  │      S3      │         │
│  │  Functions   │  │   NoSQL DB   │  │ Object Store │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  Lambda Functions:                                               │
│  • fileProcessor      - File metadata extraction                │
│  • notificationService - Email/push notifications               │
│  • analyticsService   - Event tracking and reporting            │
│  • backupService      - Automated backups                       │
│  • folderService      - Folder management                       │
│  • fileService        - File operations                         │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
Frontend Components
├── Pages
│   ├── Index (Auth Landing)
│   ├── Dashboard (Main File Manager)
│   ├── Folders (Folder Management)
│   ├── ShareFiles (WeTransfer-style Sharing)
│   ├── SharedFiles (Transfer Management)
│   ├── Trash (Deleted Items)
│   ├── ProfileSettings (User Profile)
│   └── StorageSettings (Storage Management)
│
├── Components
│   ├── auth/
│   │   ├── AuthPage
│   │   ├── LoginForm
│   │   ├── RegisterForm
│   │   ├── ForgotPasswordForm
│   │   ├── EmailVerification
│   │   └── AuthGuard
│   │
│   ├── dashboard/
│   │   ├── DashboardLayout
│   │   ├── DashboardHeader
│   │   └── AppSidebar
│   │
│   ├── upload/
│   │   ├── FileUpload
│   │   ├── UploadDialog
│   │   └── FileManager
│   │
│   └── ui/ (Shadcn/ui components)
│
└── Services
    ├── authService (Cognito integration)
    ├── s3Service (File storage operations)
    ├── dynamoService (Database operations)
    └── lambdaService (Backend function calls)
```

## Data Models

### User Model (DynamoDB)

```typescript
interface User {
  id: string;                    // Primary Key (Cognito User ID)
  email: string;                 // Unique email address
  firstName: string;             // User's first name
  lastName: string;              // User's last name
  profilePicture?: string;       // S3 URL to profile image
  storageUsed: number;           // Bytes used
  storageLimit: number;          // Bytes allowed (default: 15GB)
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  
  // Relationships
  folders: Folder[];             // HasMany relationship
  files: File[];                 // HasMany relationship
  shareLinks: ShareLink[];       // HasMany relationship
  analytics: Analytics[];        // HasMany relationship
}
```

### Folder Model (DynamoDB)

```typescript
interface Folder {
  id: string;                    // Primary Key (UUID)
  name: string;                  // Folder display name
  parentId?: string;             // Foreign Key to parent Folder
  userId: string;                // Foreign Key to User (owner)
  allowedFileTypes: string[];    // Allowed MIME types or 'all'
  confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
  importance: 'low' | 'medium' | 'high' | 'critical';
  allowSharing: boolean;         // Can files be shared from this folder
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  
  // Relationships
  parent?: Folder;               // BelongsTo relationship
  children: Folder[];            // HasMany relationship
  files: File[];                 // HasMany relationship
  user: User;                    // BelongsTo relationship
}
```

### File Model (DynamoDB)

```typescript
interface File {
  id: string;                    // Primary Key (UUID)
  name: string;                  // Original filename
  type: string;                  // MIME type
  size: number;                  // File size in bytes
  s3Key: string;                 // S3 object key
  folderId?: string;             // Foreign Key to Folder
  userId: string;                // Foreign Key to User (owner)
  tags: string[];                // User-defined tags
  confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
  importance: 'low' | 'medium' | 'high' | 'critical';
  allowSharing: boolean;         // Can this file be shared
  downloadCount: number;         // Number of downloads
  lastAccessed?: string;         // ISO 8601 timestamp
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  
  // Relationships
  folder?: Folder;               // BelongsTo relationship
  user: User;                    // BelongsTo relationship
  shareLinks: ShareLink[];       // HasMany relationship
}
```

### ShareLink Model (DynamoDB)

```typescript
interface ShareLink {
  id: string;                    // Primary Key (UUID)
  fileId: string;                // Foreign Key to File
  userId: string;                // Foreign Key to User (creator)
  token: string;                 // Unique share token
  expiresAt?: string;            // ISO 8601 timestamp
  downloadLimit?: number;        // Max downloads allowed
  downloadCount: number;         // Current download count
  isActive: boolean;             // Link status
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
  
  // Relationships
  file: File;                    // BelongsTo relationship
  user: User;                    // BelongsTo relationship
}
```

### Analytics Model (DynamoDB)

```typescript
interface Analytics {
  id: string;                    // Primary Key (UUID)
  userId: string;                // Foreign Key to User
  eventType: 'file_upload' | 'file_download' | 'file_share' | 
             'folder_create' | 'storage_usage';
  eventData: {                   // JSON object with event details
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    folderName?: string;
    shareRecipients?: string[];
    downloadCount?: number;
    storageUsed?: number;
    storageLimit?: number;
    ipAddress?: string;
    userAgent?: string;
  };
  timestamp: string;             // ISO 8601 timestamp
  
  // Relationships
  user: User;                    // BelongsTo relationship
}
```

### FileMetadata Model (S3 Metadata)

```typescript
interface FileMetadata {
  id: string;                    // File identifier
  name: string;                  // Original filename
  type: string;                  // MIME type
  size: number;                  // File size in bytes
  s3Key: string;                 // S3 object key
  folderId?: string;             // Folder identifier
  tags?: string[];               // User-defined tags
  confidentiality: 'public' | 'internal' | 'confidential' | 'restricted';
  importance: 'low' | 'medium' | 'high' | 'critical';
  allowSharing: boolean;         // Sharing permission
  
  // Sharing metadata (for transfers)
  shareRecipients?: string[];    // Email addresses
  shareMessage?: string;         // Optional message
  shareExpirationDays?: number;  // Days until expiration
  shareLink?: string;            // Generated share URL
  shareSender?: {                // Sender information
    name: string;
    surname: string;
    email: string;
  };
  
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

### Transfer Model (Application State)

```typescript
interface Transfer {
  id: string;                    // Transfer identifier
  name: string;                  // Transfer name/title
  files: Array<{                 // Files in this transfer
    name: string;
    type: string;
    size: string;
  }>;
  recipients: string[];          // Email addresses
  message?: string;              // Optional message
  createdAt: string;             // ISO 8601 timestamp
  expiresAt: string;             // ISO 8601 timestamp
  downloads: number;             // Download count
  maxDownloads?: number;         // Optional download limit
  status: 'active' | 'expired' | 'deleted';
  shareLink: string;             // Generated share URL
}
```

## Components and Interfaces

### Authentication Service

**Purpose**: Manage user authentication and session handling through AWS Cognito

**Key Methods**:
- `signUp(data: SignUpData)`: Create new user account
- `confirmSignUp(data: ConfirmSignUpData)`: Verify email with code
- `signIn(data: SignInData)`: Authenticate user
- `signOut()`: End user session
- `resetPassword(data: ResetPasswordData)`: Initiate password reset
- `confirmResetPassword(data: ConfirmResetPasswordData)`: Complete password reset
- `getCurrentUser()`: Get authenticated user details
- `isAuthenticated()`: Check authentication status
- `onAuthStateChange(callback)`: Subscribe to auth state changes

**Integration Points**:
- AWS Cognito User Pools for authentication
- Hub events for auth state management
- Token refresh for session maintenance

### S3 Service

**Purpose**: Handle file storage operations with AWS S3

**Key Methods**:
- `uploadFile(file: File, options: UploadOptions)`: Upload file to S3
- `downloadFile(s3Key: string)`: Download file from S3
- `getFileUrl(s3Key: string, expiresIn: number)`: Generate signed URL
- `refreshFileUrl(s3Key: string)`: Refresh expired URL
- `deleteFile(s3Key: string)`: Delete file from S3
- `listFiles(folderId?: string)`: List files in folder
- `uploadMultipleFiles(files: File[], options)`: Batch upload
- `createFolder(folderName: string, parentFolderId?: string)`: Create folder structure
- `listFolders(parentFolderId?: string)`: List folders
- `deleteFolder(folderId: string)`: Delete folder and contents
- `getFolderMetadata(folderId: string)`: Retrieve folder metadata
- `updateFileMetadata(s3Key: string, metadata: FileMetadata)`: Update file metadata

**Storage Structure**:
```
S3 Bucket Structure:
├── {folderName}/
│   ├── {timestamp}_{filename}
│   └── .folder_placeholder
├── .metadata/
│   ├── folders/
│   │   └── {folderId}.json
│   └── files/
│       └── {fileId}.json
└── shared/
    └── {timestamp}_{filename}
```

**Integration Points**:
- AWS S3 for object storage
- Amplify Storage API for operations
- Progress callbacks for upload tracking

### DynamoDB Service

**Purpose**: Manage structured data and relationships in DynamoDB

**Key Methods**:
- `createFolder(input: CreateFolderInput)`: Create folder record
- `listFolders(parentId?: string)`: List folders by parent
- `getAllFolders()`: Get all user folders
- `getFolder(folderId: string)`: Get folder by ID
- `updateFolder(folderId: string, updates)`: Update folder
- `deleteFolder(folderId: string)`: Delete folder record
- `getFolderPath(folderId: string)`: Get folder hierarchy

**Integration Points**:
- AWS DynamoDB via Amplify Data
- GraphQL API for queries and mutations
- Automatic user filtering via Cognito

### Lambda Service

**Purpose**: Coordinate backend operations through Lambda functions

**Key Methods**:
- `processFile(request: FileProcessingRequest)`: Extract file metadata
- `sendNotification(request: NotificationRequest)`: Send notifications
- `trackEvent(request: AnalyticsRequest)`: Log analytics events
- `createFolder(request: FolderCreateRequest)`: Create folder via Lambda
- `getFolders(userEmail: string)`: List folders via Lambda
- `deleteFolder(userEmail: string, folderId: string)`: Delete folder
- `uploadFile(request: FileUploadRequest)`: Process file upload
- `getFiles(userEmail: string, folderId?: string)`: List files
- `getAnalyticsReport(userId: string)`: Generate analytics report
- `performBackup(request: BackupRequest)`: Execute backup operations

**Fallback Mechanism**:
- Detect if Lambda functions are deployed
- Fall back to direct S3/DynamoDB operations when unavailable
- Graceful degradation for non-critical features

**Integration Points**:
- AWS Lambda functions via API Gateway
- REST API endpoints for each service
- Error handling with fallback to direct AWS SDK calls

## Error Handling

### Error Categories

1. **Authentication Errors**
   - Invalid credentials
   - Unverified email
   - Expired session
   - MFA failures

2. **File Operation Errors**
   - Upload failures
   - Download errors
   - File not found
   - Insufficient storage

3. **Network Errors**
   - Connection timeout
   - API unavailable
   - Rate limiting

4. **Validation Errors**
   - Invalid file type
   - File size exceeded
   - Missing required fields

### Error Handling Strategy

```typescript
interface ErrorResponse {
  success: boolean;
  error?: string;
  code?: string;
  details?: any;
}

// Consistent error response format
try {
  // Operation
  return { success: true, data: result };
} catch (error) {
  return {
    success: false,
    error: error.message || 'Operation failed',
    code: error.code,
    details: error.details
  };
}
```

### User Feedback

- Display toast notifications for all operations
- Show inline error messages for form validation
- Provide actionable error messages with recovery steps
- Log errors to CloudWatch for debugging

## Testing Strategy

### Unit Testing

**Components to Test**:
- Service layer methods (authService, s3Service, dynamoService, lambdaService)
- Utility functions (file size formatting, date formatting)
- Data validation logic
- Error handling functions

**Testing Framework**: Jest + React Testing Library

**Coverage Goals**: 80% code coverage for service layer

### Integration Testing

**Scenarios to Test**:
- Complete authentication flow (signup → verify → login)
- File upload with metadata storage
- Folder creation and navigation
- File sharing with expiration
- Download with URL refresh
- Trash and recovery operations

**Testing Approach**: End-to-end tests with mock AWS services

### Performance Testing

**Metrics to Monitor**:
- Page load time (< 2 seconds)
- File upload speed (progress updates every second)
- API response time (< 200ms for 95th percentile)
- Concurrent user capacity (10,000+ users)

**Tools**: Lighthouse, WebPageTest, AWS CloudWatch

### Security Testing

**Areas to Test**:
- Authentication bypass attempts
- Unauthorized file access
- SQL injection (DynamoDB)
- XSS vulnerabilities
- CSRF protection
- Data encryption verification

**Tools**: OWASP ZAP, AWS Security Hub

## Security Considerations

### Authentication Security

- Password requirements: 8+ characters, mixed case, numbers, symbols
- Optional MFA with TOTP
- Session management with automatic token refresh
- Secure password reset flow with verification codes

### Data Security

- **Encryption at Rest**: S3 server-side encryption (SSE-S3)
- **Encryption in Transit**: TLS 1.3 for all connections
- **Access Control**: IAM roles and Cognito user pools
- **Signed URLs**: Temporary access with expiration (24 hours)
- **Audit Logging**: CloudTrail for all AWS API calls

### Application Security

- **Input Validation**: Sanitize all user inputs
- **File Type Validation**: Verify MIME types and extensions
- **Size Limits**: Enforce 2GB per transfer, quota per user
- **Rate Limiting**: API Gateway throttling
- **CORS**: Restrict origins to application domain

### Privacy and Compliance

- **GDPR Compliance**: User data export and deletion
- **Data Residency**: Configurable AWS region
- **Audit Trails**: Complete activity logging
- **User Consent**: Privacy policy acceptance
- **Data Retention**: 30-day trash retention, configurable backups

## Performance Optimization

### Frontend Optimization

- **Code Splitting**: Lazy load routes and components
- **Asset Optimization**: Compress images and minify code
- **Caching**: Service worker for offline support
- **Virtual Scrolling**: For large file lists
- **Debouncing**: Search input and API calls

### Backend Optimization

- **DynamoDB**: 
  - Use GSI for efficient queries
  - Batch operations for multiple items
  - Auto-scaling for read/write capacity

- **S3**:
  - CloudFront CDN for global distribution
  - Transfer Acceleration for large files
  - Multipart upload for files > 100MB

- **Lambda**:
  - Provisioned concurrency for critical functions
  - Memory optimization (1024MB-3008MB)
  - Connection pooling for database access

### Monitoring and Alerts

- **CloudWatch Metrics**: Track API latency, error rates, storage usage
- **CloudWatch Alarms**: Alert on threshold breaches
- **X-Ray Tracing**: Distributed tracing for debugging
- **Custom Metrics**: Track business KPIs (uploads, shares, active users)

## Deployment Strategy

### Infrastructure as Code

- **Amplify Gen 2**: Define backend resources in TypeScript
- **CDK**: Custom infrastructure components
- **Version Control**: Git-based deployment workflow

### Environments

1. **Development**: Local development with Amplify sandbox
2. **Staging**: Pre-production testing environment
3. **Production**: Live environment with monitoring

### CI/CD Pipeline

```
Code Push → GitHub Actions
  ↓
Build & Test
  ↓
Deploy to Staging
  ↓
Integration Tests
  ↓
Manual Approval
  ↓
Deploy to Production
  ↓
Smoke Tests
  ↓
Monitor Metrics
```

### Rollback Strategy

- **Blue-Green Deployment**: Zero-downtime deployments
- **Feature Flags**: Gradual rollout of new features
- **Database Migrations**: Backward-compatible schema changes
- **Automated Rollback**: Trigger on error rate threshold

## Scalability Considerations

### Horizontal Scaling

- **Lambda**: Automatic scaling to 1000+ concurrent executions
- **DynamoDB**: On-demand capacity mode for unpredictable traffic
- **S3**: Unlimited storage capacity
- **CloudFront**: Global edge locations for content delivery

### Vertical Scaling

- **Lambda Memory**: Increase for compute-intensive operations
- **DynamoDB Capacity**: Provision higher throughput for peak loads
- **API Gateway**: Increase throttle limits

### Cost Optimization

- **S3 Lifecycle Policies**: Move old files to Glacier
- **DynamoDB TTL**: Auto-delete expired records
- **Lambda Optimization**: Reduce execution time and memory
- **CloudWatch Logs**: Set retention periods

## Future Enhancements

### Phase 2 Features

1. **Real-time Collaboration**: Multiple users editing shared files
2. **Version History**: Track file changes over time
3. **Advanced Search**: Full-text search with Elasticsearch
4. **Mobile Apps**: Native iOS and Android applications
5. **Desktop Sync**: Automatic folder synchronization
6. **Team Workspaces**: Shared spaces for organizations
7. **Advanced Analytics**: Custom reports and dashboards
8. **API Access**: RESTful API for third-party integrations

### Technical Improvements

1. **GraphQL Subscriptions**: Real-time updates
2. **WebSocket Support**: Live notifications
3. **Progressive Web App**: Offline functionality
4. **Machine Learning**: Automatic file categorization
5. **Blockchain**: Immutable audit trail
6. **Multi-region**: Global data replication
