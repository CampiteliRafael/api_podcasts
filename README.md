# Podcast Management API

A Node.js/TypeScript API for managing podcasts, episodes, and analytics using TypeORM and AWS S3 integration following clean architecture principles.

## Architectural Patterns
- **Layered Architecture** with separation of concerns:
  - Presentation Layer: Express controllers
  - Application Layer: Services with business logic
  - Domain Layer: Entities and interfaces
  - Infrastructure Layer: TypeORM repositories and AWS integration
- **Repository Pattern** for database operations
- **DTO Pattern** using class-validator decorators

```typescript
// Example Entity
@Entity()
export class Podcast {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column({ type: 'text' })
  description: string;
}
```

## Core Technologies
| Technology       | Purpose                          |
|------------------|----------------------------------|
| TypeORM          | Database ORM with migrations     |
| Express          | REST API framework               |
| AWS SDK v3       | File storage in S3               |
| JWT              | Authentication/Authorization     |
| class-validator  | Request validation               |
| Jest             | Testing framework                |

## Key Features
1. Podcast CRUD operations
2. Episode file uploads to S3
3. JWT-based authentication
4. Listening analytics aggregation
5. TypeORM migrations

## Installation & Setup
```bash
npm install
npm run build
npm run typeorm migration:run
```

## Environment Configuration
```env
DATABASE_URL=postgres://user:pass@localhost:5432/podcasts
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET_NAME=podcast-bucket
```

## Example Service Implementation
```typescript
// podcast.service.ts
export class PodcastService {
  constructor(
    private podcastRepository: Repository<Podcast>,
    private s3Client: S3Client
  ) {}

  async createPodcast(dto: CreatePodcastDto): Promise<Podcast> {
    const podcast = this.podcastRepository.create(dto);
    return this.podcastRepository.save(podcast);
  }
}
```

## API Endpoint Examples

### Create Podcast (POST /podcasts)
```bash
curl -X POST http://localhost:3000/api/podcasts \
  -H "Authorization: Bearer $JWT" \
  -d '{
    "title": "Dev Insights",
    "description": "Weekly developer podcast"
  }'
```

### Get Analytics (GET /analytics/listens)
```typescript
// analytics.controller.ts
@Get('listens')
async getListeningStats(
  @Query() params: AnalyticsParams
) {
  return this.analyticsService.getListenStats(params);
}
```

## Testing Strategy
- Unit tests for services
- Integration tests for API endpoints
- Mocked AWS/S3 interactions
- Test coverage reporting with Istanbul

```bash
npm test # Run test suite
```

## Deployment
1. Database provisioning
2. Environment configuration
3. Migration execution
4. PM2 process management

```bash
npm run typeorm migration:run
npm start
```

## Documentation
- OpenAPI 3.0 specification in /docs
- Postman collection available
- Entity relationship diagrams