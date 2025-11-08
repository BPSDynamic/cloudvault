# CloudVault Backend Infrastructure - Design Document

## Overview

This document outlines the comprehensive backend infrastructure design for CloudVault using AWS Amplify Gen 2 and AWS CDK v2, following AWS Well-Architected Framework principles and CDK best practices.

## Architecture Principles

### 1. AWS CDK Best Practices

#### Construct Hierarchy
```
L3 (Patterns) - High-level, opinionated patterns
    ↓
L2 (Constructs) - AWS service constructs with sensible defaults
    ↓
L1 (CFN Resources) - Direct CloudFormation resources
```

#### Stack Organization
- **Single Responsibility**: Each stack has one clear purpose
- **Loose Coupling**: Stacks communicate through exports/imports
- **High Cohesion**: Related resources grouped together
- **Environment Agnostic**: Stacks work across environments

#### Resource Naming
```typescript
// Pattern: {project}-{environment}-{resource}-{purpose}
const bucketName = `cloudvault-${env}-storage-files`;
const tableName = `cloudvault-${env}-data-users`;
const functionName = `cloudvault-${env}-function-fileprocessor`;
```

### 2. AWS Well-Architected Framework

#### Operational Excellence
- Infrastructure as Code (CDK)
- Automated deployments (CodePipeline)
- Monitoring and logging (CloudWatch)
- Incident response (SNS alerts)

#### Security
- Least privilege IAM (custom roles)
- Encryption at rest (KMS)
- Encryption in transit (TLS 1.3)
- Network isolation (VPC)
- Secrets management (Secrets Manager)

#### Reliability
- Multi-AZ deployment
- Automated backups
- Auto-scaling
- Health checks
- Disaster recovery

#### Performance Efficiency
- Right-sized resources
- Caching (CloudFront, DAX)
- Asynchronous processing (SQS)
- Performance monitoring

#### Cost Optimization
- On-demand billing
- Lifecycle policies
- Reserved capacity
- Cost monitoring

#### Sustainability
- Efficient code
- Appropriate sizing
- Regional optimization

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                    Amplify Hosting / CloudFront                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (HTTP API)                      │
│                    Cognito Authorizer + WAF                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Lambda Functions Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ fileService  │  │folderService │  │analyticsServ │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │fileProcessor │  │notification  │  │backupService │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data & Storage Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  DynamoDB    │  │      S3      │  │   Cognito    │         │
│  │  (5 tables)  │  │  (buckets)   │  │  (User Pool) │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Event-Driven Architecture                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ EventBridge  │  │     SQS      │  │  S3 Events   │         │
│  │   (rules)    │  │   (queues)   │  │ (triggers)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Monitoring & Observability                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  CloudWatch  │  │    X-Ray     │  │ CloudTrail   │         │
│  │  (metrics)   │  │  (tracing)   │  │  (audit)     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
cloudvault/
├── amplify/                          # Amplify Gen 2 (Core Services)
│   ├── backend.ts                    # Main backend definition
│   ├── auth/
│   │   └── resource.ts              # Cognito configuration
│   ├── data/
│   │   └── resource.ts              # DynamoDB schema
│   ├── storage/
│   │   └── resource.ts              # S3 configuration
│   └── functions/                    # Lambda functions
│       ├── fileProcessor/
│       ├── notificationService/
│       ├── analyticsService/
│       ├── backupService/
│       ├── folderService/
│       └── fileService/
│
├── infrastructure/                   # CDK Infrastructure
│   ├── bin/
│   │   └── cloudvault-infra.ts     # CDK app entry point
│   ├── lib/
│   │   ├── stacks/                  # CDK Stacks
│   │   │   ├── api-gateway-stack.ts
│   │   │   ├── events-stack.ts
│   │   │   ├── monitoring-stack.ts
│   │   │   ├── security-stack.ts
│   │   │   ├── network-stack.ts
│   │   │   └── cicd-stack.ts
│   │   ├── constructs/              # Reusable constructs
│   │   │   ├── lambda-function.ts
│   │   │   ├── api-route.ts
│   │   │   └── alarm-set.ts
│   │   └── config/                  # Configuration
│   │       ├── environments.ts
│   │       └── constants.ts
│   ├── test/                        # Infrastructure tests
│   │   ├── unit/
│   │   ├── integration/
│   │   └── snapshot/
│   ├── cdk.json                     # CDK configuration
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                          # Shared code
│   ├── types/                       # TypeScript types
│   ├── utils/                       # Utility functions
│   ├── validators/                  # Zod schemas
│   └── constants/                   # Shared constants
│
└── docs/                            # Documentation
    ├── architecture/
    ├── runbooks/
    └── compliance/
```

---

## Stack Design

### 1. Foundation Stack (Amplify Gen 2)

**Purpose**: Core backend services managed by Amplify

**Resources**:
- Cognito User Pool (authentication)
- DynamoDB Tables (data layer)
- S3 Buckets (file storage)
- Lambda Functions (business logic)

**Exports**:
```typescript
export const amplifyOutputs = {
  userPoolId: userPool.userPoolId,
  userPoolClientId: userPoolClient.userPoolClientId,
  identityPoolId: identityPool.identityPoolId,
  storageBucketName: storageBucket.bucketName,
  apiEndpoint: api.apiEndpoint,
  region: Stack.of(this).region,
};
```

---

### 2. API Gateway Stack

**Purpose**: HTTP API for Lambda function access

**Resources**:
```typescript
export class ApiGatewayStack extends Stack {
  public readonly api: HttpApi;
  public readonly authorizer: HttpUserPoolAuthorizer;

  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    // HTTP API
    this.api = new HttpApi(this, 'CloudVaultApi', {
      apiName: `cloudvault-${props.environment}-api`,
      description: 'CloudVault HTTP API',
      corsPreflight: {
        allowOrigins: props.allowedOrigins,
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: ['*'],
        maxAge: Duration.days(1),
      },
    });

    // Cognito Authorizer
    this.authorizer = new HttpUserPoolAuthorizer('CognitoAuthorizer', 
      props.userPool,
      {
        userPoolClients: [props.userPoolClient],
        identitySource: ['$request.header.Authorization'],
      }
    );

    // Routes
    this.addRoutes(props.functions);
  }

  private addRoutes(functions: LambdaFunctions) {
    // File routes
    this.api.addRoutes({
      path: '/api/files',
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: new HttpLambdaIntegration('FilesIntegration', functions.fileService),
      authorizer: this.authorizer,
    });

    // Folder routes
    this.api.addRoutes({
      path: '/api/folders',
      methods: [HttpMethod.GET, HttpMethod.POST, HttpMethod.DELETE],
      integration: new HttpLambdaIntegration('FoldersIntegration', functions.folderService),
      authorizer: this.authorizer,
    });

    // Analytics routes
    this.api.addRoutes({
      path: '/api/analytics',
      methods: [HttpMethod.GET, HttpMethod.POST],
      integration: new HttpLambdaIntegration('AnalyticsIntegration', functions.analyticsService),
      authorizer: this.authorizer,
    });
  }
}
```

**Exports**:
- API endpoint URL
- API ID
- Authorizer ID

---

### 3. Events Stack

**Purpose**: Event-driven architecture components

**Resources**:
```typescript
export class EventsStack extends Stack {
  constructor(scope: Construct, id: string, props: EventsStackProps) {
    super(scope, id, props);

    // S3 Event Notifications
    props.storageBucket.addEventNotification(
      EventType.OBJECT_CREATED,
      new LambdaDestination(props.functions.fileProcessor),
      { prefix: 'uploads/' }
    );

    // EventBridge Rule for scheduled backups
    new Rule(this, 'DailyBackupRule', {
      schedule: Schedule.cron({ hour: '2', minute: '0' }),
      targets: [new LambdaFunction(props.functions.backupService)],
    });

    // SQS Queue for notifications
    const notificationQueue = new Queue(this, 'NotificationQueue', {
      queueName: `cloudvault-${props.environment}-notifications`,
      visibilityTimeout: Duration.seconds(300),
      retentionPeriod: Duration.days(14),
      deadLetterQueue: {
        queue: new Queue(this, 'NotificationDLQ', {
          queueName: `cloudvault-${props.environment}-notifications-dlq`,
        }),
        maxReceiveCount: 3,
      },
    });

    // Lambda event source mapping
    props.functions.notificationService.addEventSource(
      new SqsEventSource(notificationQueue, {
        batchSize: 10,
        maxBatchingWindow: Duration.seconds(5),
      })
    );
  }
}
```

---

### 4. Monitoring Stack

**Purpose**: Observability and alerting

**Resources**:
```typescript
export class MonitoringStack extends Stack {
  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    // CloudWatch Dashboard
    const dashboard = new Dashboard(this, 'OperationalDashboard', {
      dashboardName: `cloudvault-${props.environment}-ops`,
    });

    // API Gateway Metrics
    dashboard.addWidgets(
      new GraphWidget({
        title: 'API Gateway Requests',
        left: [
          props.api.metricCount(),
          props.api.metric4XXError(),
          props.api.metric5XXError(),
        ],
      })
    );

    // Lambda Metrics
    Object.entries(props.functions).forEach(([name, fn]) => {
      dashboard.addWidgets(
        new GraphWidget({
          title: `${name} Metrics`,
          left: [
            fn.metricInvocations(),
            fn.metricErrors(),
            fn.metricDuration(),
          ],
        })
      );

      // Alarms
      new Alarm(this, `${name}ErrorAlarm`, {
        metric: fn.metricErrors(),
        threshold: 10,
        evaluationPeriods: 2,
        alarmDescription: `${name} error rate exceeded threshold`,
        actionsEnabled: true,
      });
    });

    // DynamoDB Metrics
    Object.entries(props.tables).forEach(([name, table]) => {
      dashboard.addWidgets(
        new GraphWidget({
          title: `${name} Table Metrics`,
          left: [
            table.metricConsumedReadCapacityUnits(),
            table.metricConsumedWriteCapacityUnits(),
          ],
        })
      );
    });

    // X-Ray Tracing
    Object.values(props.functions).forEach(fn => {
      fn.addEnvironment('AWS_XRAY_TRACING_NAME', fn.functionName);
      fn.addToRolePolicy(new PolicyStatement({
        actions: [
          'xray:PutTraceSegments',
          'xray:PutTelemetryRecords',
        ],
        resources: ['*'],
      }));
    });
  }
}
```

---

### 5. Security Stack

**Purpose**: Security controls and compliance

**Resources**:
```typescript
export class SecurityStack extends Stack {
  constructor(scope: Construct, id: string, props: SecurityStackProps) {
    super(scope, id, props);

    // KMS Keys
    const s3Key = new Key(this, 'S3EncryptionKey', {
      description: 'KMS key for S3 bucket encryption',
      enableKeyRotation: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const dynamoKey = new Key(this, 'DynamoEncryptionKey', {
      description: 'KMS key for DynamoDB encryption',
      enableKeyRotation: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // Secrets Manager
    const apiKeys = new Secret(this, 'ApiKeys', {
      secretName: `cloudvault-${props.environment}-api-keys`,
      description: 'API keys for external services',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({}),
        generateStringKey: 'apiKey',
      },
    });

    // WAF for API Gateway
    const webAcl = new CfnWebACL(this, 'ApiWaf', {
      scope: 'REGIONAL',
      defaultAction: { allow: {} },
      rules: [
        {
          name: 'RateLimitRule',
          priority: 1,
          statement: {
            rateBasedStatement: {
              limit: 2000,
              aggregateKeyType: 'IP',
            },
          },
          action: { block: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'RateLimitRule',
          },
        },
      ],
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'CloudVaultWAF',
      },
    });

    // Security Hub
    new CfnHub(this, 'SecurityHub', {
      tags: {
        Environment: props.environment,
      },
    });

    // GuardDuty
    new CfnDetector(this, 'GuardDuty', {
      enable: true,
      findingPublishingFrequency: 'FIFTEEN_MINUTES',
    });
  }
}
```

---

### 6. Network Stack

**Purpose**: VPC and network isolation

**Resources**:
```typescript
export class NetworkStack extends Stack {
  public readonly vpc: Vpc;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    // VPC
    this.vpc = new Vpc(this, 'CloudVaultVpc', {
      vpcName: `cloudvault-${props.environment}-vpc`,
      maxAzs: 3,
      natGateways: props.environment === 'production' ? 3 : 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'Private',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: 'Isolated',
          subnetType: SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    // VPC Endpoints
    this.vpc.addGatewayEndpoint('S3Endpoint', {
      service: GatewayVpcEndpointAwsService.S3,
    });

    this.vpc.addInterfaceEndpoint('DynamoDBEndpoint', {
      service: InterfaceVpcEndpointAwsService.DYNAMODB,
    });

    // Security Groups
    const lambdaSecurityGroup = new SecurityGroup(this, 'LambdaSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for Lambda functions',
      allowAllOutbound: true,
    });

    // Flow Logs
    new FlowLog(this, 'VpcFlowLog', {
      resourceType: FlowLogResourceType.fromVpc(this.vpc),
      trafficType: FlowLogTrafficType.ALL,
    });
  }
}
```

---

### 7. CI/CD Stack

**Purpose**: Automated deployment pipeline

**Resources**:
```typescript
export class CiCdStack extends Stack {
  constructor(scope: Construct, id: string, props: CiCdStackProps) {
    super(scope, id, props);

    // Source
    const sourceOutput = new Artifact();
    const sourceAction = new GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'BPSDynamic',
      repo: 'cloudvault',
      oauthToken: SecretValue.secretsManager('github-token'),
      output: sourceOutput,
      branch: props.branch,
    });

    // Build
    const buildOutput = new Artifact();
    const buildProject = new PipelineProject(this, 'BuildProject', {
      environment: {
        buildImage: LinuxBuildImage.STANDARD_7_0,
        computeType: ComputeType.SMALL,
      },
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'npm install',
              'cd infrastructure && npm install',
            ],
          },
          build: {
            commands: [
              'npm run build',
              'npm run test',
              'cd infrastructure && npm run build',
              'cd infrastructure && npm run test',
            ],
          },
        },
        artifacts: {
          files: ['**/*'],
        },
      }),
    });

    const buildAction = new CodeBuildAction({
      actionName: 'Build',
      project: buildProject,
      input: sourceOutput,
      outputs: [buildOutput],
    });

    // Deploy to Dev
    const deployDevAction = new CloudFormationCreateUpdateStackAction({
      actionName: 'Deploy_Dev',
      stackName: 'cloudvault-dev',
      templatePath: buildOutput.atPath('infrastructure/cdk.out/CloudVaultDevStack.template.json'),
      adminPermissions: true,
    });

    // Manual Approval
    const approvalAction = new ManualApprovalAction({
      actionName: 'Approve_Production',
      notificationTopic: new Topic(this, 'ApprovalTopic'),
    });

    // Deploy to Production
    const deployProdAction = new CloudFormationCreateUpdateStackAction({
      actionName: 'Deploy_Production',
      stackName: 'cloudvault-production',
      templatePath: buildOutput.atPath('infrastructure/cdk.out/CloudVaultProductionStack.template.json'),
      adminPermissions: true,
    });

    // Pipeline
    new Pipeline(this, 'Pipeline', {
      pipelineName: `cloudvault-${props.environment}-pipeline`,
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [buildAction],
        },
        {
          stageName: 'Deploy_Dev',
          actions: [deployDevAction],
        },
        {
          stageName: 'Approval',
          actions: [approvalAction],
        },
        {
          stageName: 'Deploy_Production',
          actions: [deployProdAction],
        },
      ],
    });
  }
}
```

---

## Reusable Constructs

### 1. Enhanced Lambda Function

```typescript
export class EnhancedLambdaFunction extends Construct {
  public readonly function: Function;

  constructor(scope: Construct, id: string, props: EnhancedLambdaProps) {
    super(scope, id);

    this.function = new Function(this, 'Function', {
      functionName: `cloudvault-${props.environment}-${props.name}`,
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: Code.fromAsset(props.codePath),
      timeout: Duration.seconds(props.timeout || 30),
      memorySize: props.memorySize || 1024,
      environment: {
        ENVIRONMENT: props.environment,
        LOG_LEVEL: props.logLevel || 'INFO',
        ...props.environment,
      },
      tracing: Tracing.ACTIVE,
      logRetention: RetentionDays.ONE_WEEK,
      reservedConcurrentExecutions: props.reservedConcurrency,
    });

    // Add alarms
    this.addAlarms(props);

    // Add tags
    Tags.of(this.function).add('Environment', props.environment);
    Tags.of(this.function).add('Project', 'CloudVault');
  }

  private addAlarms(props: EnhancedLambdaProps) {
    new Alarm(this, 'ErrorAlarm', {
      metric: this.function.metricErrors(),
      threshold: 10,
      evaluationPeriods: 2,
    });

    new Alarm(this, 'ThrottleAlarm', {
      metric: this.function.metricThrottles(),
      threshold: 5,
      evaluationPeriods: 1,
    });
  }
}
```

---

## Configuration Management

### Environment Configuration

```typescript
export interface EnvironmentConfig {
  environment: string;
  region: string;
  account: string;
  
  // Scaling
  minCapacity: number;
  maxCapacity: number;
  
  // Retention
  logRetentionDays: number;
  backupRetentionDays: number;
  
  // Costs
  enableReservedCapacity: boolean;
  
  // Security
  enableWaf: boolean;
  enableGuardDuty: boolean;
  
  // Monitoring
  enableDetailedMonitoring: boolean;
  alarmEmail: string;
}

export const environments: Record<string, EnvironmentConfig> = {
  dev: {
    environment: 'dev',
    region: 'us-east-1',
    account: '123456789012',
    minCapacity: 1,
    maxCapacity: 10,
    logRetentionDays: 7,
    backupRetentionDays: 7,
    enableReservedCapacity: false,
    enableWaf: false,
    enableGuardDuty: false,
    enableDetailedMonitoring: false,
    alarmEmail: 'dev-team@cloudvault.com',
  },
  production: {
    environment: 'production',
    region: 'us-east-1',
    account: '123456789012',
    minCapacity: 5,
    maxCapacity: 100,
    logRetentionDays: 30,
    backupRetentionDays: 90,
    enableReservedCapacity: true,
    enableWaf: true,
    enableGuardDuty: true,
    enableDetailedMonitoring: true,
    alarmEmail: 'ops-team@cloudvault.com',
  },
};
```

---

## Testing Strategy

### 1. Unit Tests
```typescript
describe('ApiGatewayStack', () => {
  test('creates HTTP API with correct configuration', () => {
    const app = new App();
    const stack = new ApiGatewayStack(app, 'TestStack', {
      environment: 'test',
      userPool: mockUserPool,
      functions: mockFunctions,
    });

    const template = Template.fromStack(stack);
    
    template.hasResourceProperties('AWS::ApiGatewayV2::Api', {
      Name: 'cloudvault-test-api',
      ProtocolType: 'HTTP',
    });
  });
});
```

### 2. Integration Tests
```typescript
describe('Full Stack Integration', () => {
  test('all stacks deploy successfully', async () => {
    const app = new App();
    
    const networkStack = new NetworkStack(app, 'NetworkStack', config);
    const securityStack = new SecurityStack(app, 'SecurityStack', config);
    const apiStack = new ApiGatewayStack(app, 'ApiStack', {
      ...config,
      vpc: networkStack.vpc,
    });
    
    const assembly = app.synth();
    expect(assembly.stacks).toHaveLength(3);
  });
});
```

### 3. Snapshot Tests
```typescript
test('stack matches snapshot', () => {
  const app = new App();
  const stack = new MonitoringStack(app, 'TestStack', config);
  const template = Template.fromStack(stack);
  
  expect(template.toJSON()).toMatchSnapshot();
});
```

---

## Deployment Strategy

### 1. Bootstrap
```bash
# Bootstrap CDK in each environment
cdk bootstrap aws://ACCOUNT/REGION --profile dev
cdk bootstrap aws://ACCOUNT/REGION --profile production
```

### 2. Deploy Order
```bash
# 1. Network Stack (VPC, subnets)
cdk deploy NetworkStack --profile dev

# 2. Security Stack (KMS, Secrets Manager)
cdk deploy SecurityStack --profile dev

# 3. Foundation (Amplify resources)
npx ampx sandbox --profile dev

# 4. API Gateway Stack
cdk deploy ApiGatewayStack --profile dev

# 5. Events Stack
cdk deploy EventsStack --profile dev

# 6. Monitoring Stack
cdk deploy MonitoringStack --profile dev

# 7. CI/CD Stack
cdk deploy CiCdStack --profile dev
```

### 3. Rollback Strategy
```bash
# Rollback to previous version
cdk deploy --rollback

# Or use CloudFormation console
aws cloudformation rollback-stack --stack-name cloudvault-dev
```

---

## Cost Optimization

### 1. Lambda
- Use ARM64 architecture (20% cost savings)
- Right-size memory allocation
- Use reserved concurrency for predictable workloads

### 2. DynamoDB
- Use on-demand billing for unpredictable workloads
- Use provisioned capacity with auto-scaling for predictable workloads
- Implement TTL for temporary data

### 3. S3
- Use Intelligent-Tiering for automatic cost optimization
- Implement lifecycle policies
- Use S3 Select for query optimization

### 4. Monitoring
- Set appropriate log retention periods
- Use metric filters instead of storing all logs
- Aggregate metrics before sending to CloudWatch

---

## Security Best Practices

### 1. Least Privilege
- Each Lambda has minimal IAM permissions
- Use resource-based policies where possible
- Implement SCPs for organization-level controls

### 2. Encryption
- All data encrypted at rest (KMS)
- All data encrypted in transit (TLS 1.3)
- Rotate encryption keys annually

### 3. Network Security
- Lambda functions in private subnets
- Use VPC endpoints for AWS services
- Implement security groups with minimal rules

### 4. Secrets Management
- Never hardcode secrets
- Use Secrets Manager for all sensitive data
- Implement automatic rotation

---

## Disaster Recovery

### RTO and RPO Targets

| Service | RTO | RPO | Strategy |
|---------|-----|-----|----------|
| DynamoDB | 1 hour | 5 minutes | Point-in-time recovery |
| S3 | 4 hours | 15 minutes | Cross-region replication |
| Lambda | 30 minutes | 0 | Stateless, redeploy |
| Cognito | 2 hours | 1 hour | Backup user pool |

### Backup Strategy
- DynamoDB: Continuous backups with PITR
- S3: Versioning + cross-region replication
- Cognito: Daily exports to S3
- Infrastructure: CDK code in Git

---

## Next Steps

1. Implement CDK infrastructure stacks
2. Complete Lambda function implementations
3. Set up CI/CD pipeline
4. Configure monitoring and alerting
5. Perform security audit
6. Load testing
7. Documentation
8. Production deployment
