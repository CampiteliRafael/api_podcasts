# Configuration Documentation

## Environment Variables Reference

| Variable Name           | Description                                | Example Value                          | Required | Related Modules/Components       |
|-------------------------|--------------------------------------------|----------------------------------------|----------|-----------------------------------|
| `DATABASE_URL`          | PostgreSQL connection URL                  | `postgres://user:pass@localhost:5432/podcasts` | Yes      | TypeORM, Database Module          |
| `JWT_SECRET`            | Secret key for JWT token generation        | `your_jwt_secret_key`                  | Yes      | Authentication Middleware         |
| `AWS_ACCESS_KEY_ID`     | AWS IAM user access key ID                 | `AKIAXXXXXXXXXXXXXXXX`                 | Yes      | AWS S3 Client, File Service       |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret access key             | `your_aws_secret_key`                  | Yes      | AWS S3 Client, File Service       |
| `S3_BUCKET_NAME`        | Target S3 bucket for episode file storage  | `podcast-bucket`                       | Yes      | Episode Service, File Uploads     |
| `S3_REGION`             | AWS region for S3 bucket operations        | `us-east-1`                            | No*      | AWS SDK Configuration             |
| `PORT`                  | HTTP port for Express server               | `3000`                                 | No**     | Server Configuration              |

*Default: `us-east-1`  
**Default: `3000`

## Configuration Details

### Database Configuration (`DATABASE_URL`)
- **Format**: `postgres://[user]:[password]@[host]:[port]/[database]`
- **Usage**: Used by TypeORM to establish database connection and run migrations
- **Related Files**:
  - `src/infrastructure/database/data-source.ts`
  - TypeORM configuration files

### Authentication (`JWT_SECRET`)
- **Security Requirements**: Minimum 32-character length
- **Usage**: Used in JWT token signing/verification middleware
- **Related Components**:
  - Authentication Service
  - Authorization Middleware
  - User Controller

### AWS Configuration
- **Required Permissions**: S3 Full Access
- **Service Integration**:
  - Episode file uploads/downloads
  - Cover image storage
- **Related Services**:
  - `FileStorageService`
  - `EpisodeService`
  - AWS SDK v3 configuration

### S3 Bucket Configuration (`S3_BUCKET_NAME`)
- **Best Practices**:
  - Create separate buckets for development/production
  - Enable versioning for episode files
- **Related Operations**:
  - Presigned URL generation
  - File metadata management

### Server Configuration (`PORT`)
- **Runtime Behavior**:
  - Set through environment variable
  - Can be configured in Docker/Kubernetes deployments
  - Used in server bootstrap (`src/main.ts`)

## Configuration Validation
- All environment variables are validated at application startup using `class-validator`
- Missing required variables will prevent application startup
- TypeORM migrations will fail if `DATABASE_URL` is invalid

## Example `.env` File
```env
DATABASE_URL=postgres://podcast_user:securepass@db-host:5432/podcast_prod
JWT_SECRET=complex_secret_key_2023
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
S3_BUCKET_NAME=podcast-prod-bucket
S3_REGION=sa-east-1
PORT=8080