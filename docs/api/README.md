# SentWatch API Documentation

## Overview
This document provides comprehensive documentation for the SentWatch API endpoints.

## Base URL
```
Production: https://api.sentwatch.com/v1
Staging: https://staging-api.sentwatch.com/v1
Development: http://localhost:3000/api
```

## Authentication
All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting
- 100 requests per minute for regular users
- 1000 requests per minute for premium users
- 429 Too Many Requests response when limit is exceeded

## Common Response Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## API Versioning
The API version is included in the URL path. Current version is v1.

## Content Type
All requests should use:
```
Content-Type: application/json
```

## Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```