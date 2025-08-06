# Podcast Routes Documentation

## Base Path: `/api/v1/podcasts`

### Endpoints Overview

| Method | Path                  | Description                          | Authentication Required |
|--------|-----------------------|--------------------------------------|------------------------|
| GET    | /                     | List all podcasts                   | No                     |
| POST   | /                     | Create new podcast                  | Yes (Admin)            |
| GET    | /:id                  | Get podcast details                 | No                     |
| PUT    | /:id                  | Update podcast                      | Yes (Owner/Admin)      |
| DELETE | /:id                  | Delete podcast                      | Yes (Owner/Admin)      |
| GET    | /:id/episodes         | List podcast episodes               | No                     |
| GET    | /:id/analytics        | Get podcast listening statistics    | Yes (Owner/Admin)      |

---

## Endpoint Details

### GET / - List Podcasts
**Query Parameters:**
| Parameter | Type    | Description                      | Default |
|-----------|---------|----------------------------------|---------|
| page      | integer | Pagination page number           | 1       |
| limit     | integer | Items per page                   | 10      |
| status    | string  | Filter by status (DRAFT/PUBLISHED/ARCHIVED) | All     |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Tech Talks",
      "description": "Weekly technology discussions",
      "status": "PUBLISHED",
      "episodeCount": 15
    }
  ],
  "meta": {
    "totalItems": 100,
    "totalPages": 10,
    "currentPage": 1
  }
}
```

---

### POST / - Create Podcast
**Request Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Podcast Series",
  "description": "Exploring modern technologies",
  "coverImage": "https://example.com/cover.jpg",
  "publicationDate": "2023-11-01"
}
```

**Success Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "new-podcast-series",
  "status": "DRAFT",
  "createdAt": "2023-10-25T14:30:00Z"
}
```

**Common Errors:**
- 401 Unauthorized: Missing/invalid JWT
- 400 Bad Request: Validation errors
- 403 Forbidden: User not authorized to create podcasts

---

### GET /:id - Get Podcast Details
**Path Parameters:**
- `id`: Podcast UUID

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Tech Talks",
  "description": "Weekly technology discussions",
  "coverImage": "https://example.com/cover.jpg",
  "status": "PUBLISHED",
  "totalListens": 1500,
  "episodes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Episode 1",
      "duration": 3600
    }
  ]
}
```

**Errors:**
- 404 Not Found: Podcast not found

---

### PUT /:id - Update Podcast
**Request Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Podcast Title",
  "status": "PUBLISHED"
}
```

**Response (200 OK):**
```json
{
  "updatedAt": "2023-10-25T15:00:00Z"
}
```

**Errors:**
- 403 Forbidden: User not owner/admin
- 409 Conflict: Title already exists

---

### DELETE /:id - Delete Podcast
**Response (204 No Content):**
```http
HTTP/1.1 204 No Content
```

**Errors:**
- 403 Forbidden: User not owner/admin
- 423 Locked: Podcast has active subscriptions

---

### GET /:id/episodes - List Episodes
**Query Parameters:**
| Parameter | Type    | Description                | Default |
|-----------|---------|----------------------------|---------|
| sort      | string  | Sort field (date/duration) | date    |
| order     | string  | Sort order (asc/desc)      | desc    |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Cloud Computing Basics",
      "duration": 2700,
      "publishedAt": "2023-10-01T08:00:00Z"
    }
  ]
}
```

---

### GET /:id/analytics - Get Listening Statistics
**Query Parameters:**
| Parameter | Type    | Description                      | Required |
|-----------|---------|----------------------------------|----------|
| startDate | string  | Start date (YYYY-MM-DD)          | Yes      |
| endDate   | string  | End date (YYYY-MM-DD)            | Yes      |
| interval  | string  | Aggregation interval (day/week/month) | No       |

**Response (200 OK):**
```json
{
  "totalListens": 1500,
  "uniqueListeners": 890,
  "averageCompletion": 75.5,
  "timeSeries": [
    {
      "date": "2023-10-01",
      "listens": 120,
      "completed": 90
    }
  ]
}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data",
  "details": [
    {
      "field": "title",
      "message": "Title must be between 3-120 characters"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "AUTH_REQUIRED",
  "message": "Authentication credentials missing"
}
```

### 404 Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Podcast not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "SERVER_ERROR",
  "message": "An unexpected error occurred"
}
```