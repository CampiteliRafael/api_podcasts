# Analytics Controller - getListens Method Documentation

## Purpose
The `getListens` method retrieves podcast listening analytics data with various filtering and aggregation options. This endpoint provides insights into listener behavior and episode performance.

## Input Parameters

| Parameter    | Type     | Required | Description                                                                 | Example        |
|--------------|----------|----------|-----------------------------------------------------------------------------|----------------|
| startDate    | ISO Date | Yes      | Start date for analytics period                                             | 2023-10-01     |
| endDate      | ISO Date | Yes      | End date for analytics period                                               | 2023-10-31     |
| podcastId    | UUID     | No       | Filter results by specific podcast                                          | 550e8400...    |
| episodeId    | UUID     | No       | Filter results by specific episode                                          | 550e8400...    |
| interval     | String   | No       | Aggregation interval (hourly/daily/weekly/monthly)                          | daily          |
| metric       | String   | No       | Specific metric to return (default: all)                                    | unique_listens |

## Return Format
```json
{
  "data": {
    "totalListens": number,
    "uniqueListeners": number,
    "averageDuration": number,
    "topEpisodes": Array<{
      "episodeId": string,
      "title": string,
      "listens": number
    }>,
    "timeSeries": Array<{
      "intervalStart": ISO Date,
      "intervalEnd": ISO Date,
      "metrics": {
        "listens": number,
        "completedListens": number,
        "averageCompletion": number
      }
    }>
  },
  "meta": {
    "startDate": ISO Date,
    "endDate": ISO Date,
    "interval": string
  }
}
```

## Example Usage

**Request:**
```http
GET /analytics/listens?startDate=2023-10-01&endDate=2023-10-07&interval=daily&podcastId=550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "data": {
    "totalListens": 1500,
    "uniqueListeners": 890,
    "averageDuration": 1420,
    "topEpisodes": [
      {
        "episodeId": "550e8400-e29b-41d4-a716-446655440001",
        "title": "Introduction to Podcast Analytics",
        "listens": 450
      }
    ],
    "timeSeries": [
      {
        "intervalStart": "2023-10-01T00:00:00Z",
        "intervalEnd": "2023-10-01T23:59:59Z",
        "metrics": {
          "listens": 210,
          "completedListens": 150,
          "averageCompletion": 85.5
        }
      }
    ]
  },
  "meta": {
    "startDate": "2023-10-01",
    "endDate": "2023-10-07",
    "interval": "daily"
  }
}
```

## Notes
- Requires valid JWT authentication token
- Date range limited to 90 days maximum
- Timezone handling: All dates are processed in UTC
- Metric options: 'totalListens', 'uniqueListeners', 'averageDuration', 'completionRate'