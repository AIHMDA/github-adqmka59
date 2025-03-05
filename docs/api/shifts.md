# Shifts API Endpoints

## GET /shifts
Get all shifts with optional filtering.

### Query Parameters
- `status`: Filter by shift status (open, assigned, completed)
- `date`: Filter by date (YYYY-MM-DD)
- `location`: Filter by location ID
- `guard`: Filter by guard ID

### Response
```json
{
  "shifts": [
    {
      "id": "shift-uuid",
      "title": "Mall Security",
      "location": {
        "id": "location-uuid",
        "name": "City Mall",
        "address": "123 Main St"
      },
      "startTime": "2024-01-01T08:00:00Z",
      "endTime": "2024-01-01T16:00:00Z",
      "status": "open",
      "guard": null
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "perPage": 20
  }
}
```

## POST /shifts
Create a new shift.

### Request
```json
{
  "title": "Mall Security",
  "locationId": "location-uuid",
  "startTime": "2024-01-01T08:00:00Z",
  "endTime": "2024-01-01T16:00:00Z",
  "requiredGuards": 2,
  "requirements": ["first-aid-certified"]
}
```

### Response
```json
{
  "id": "shift-uuid",
  "title": "Mall Security",
  "location": {
    "id": "location-uuid",
    "name": "City Mall"
  },
  "startTime": "2024-01-01T08:00:00Z",
  "endTime": "2024-01-01T16:00:00Z",
  "status": "open",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## PUT /shifts/{id}/assign
Assign a guard to a shift.

### Request
```json
{
  "guardId": "guard-uuid"
}
```

### Response
```json
{
  "id": "shift-uuid",
  "status": "assigned",
  "guard": {
    "id": "guard-uuid",
    "name": "John Doe"
  },
  "assignedAt": "2024-01-01T00:00:00Z"
}
```