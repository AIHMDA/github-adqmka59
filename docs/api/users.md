# Users API Endpoints

## GET /users
Get all users with optional filtering.

### Query Parameters
- `role`: Filter by user role (admin, guard, client)
- `status`: Filter by status (active, inactive)
- `search`: Search by name or email

### Response
```json
{
  "users": [
    {
      "id": "user-uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "guard",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "perPage": 20
  }
}
```

## GET /users/{id}
Get a specific user's details.

### Response
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "guard",
  "status": "active",
  "profile": {
    "phone": "+1234567890",
    "address": "123 Main St",
    "certifications": ["first-aid", "security-license"]
  },
  "documents": [
    {
      "id": "doc-uuid",
      "type": "government-id",
      "status": "verified",
      "uploadedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## PUT /users/{id}
Update a user's information.

### Request
```json
{
  "fullName": "John Smith",
  "profile": {
    "phone": "+1234567890",
    "address": "456 New St"
  }
}
```

### Response
```json
{
  "id": "user-uuid",
  "fullName": "John Smith",
  "profile": {
    "phone": "+1234567890",
    "address": "456 New St"
  },
  "updatedAt": "2024-01-01T00:00:00Z"
}
```