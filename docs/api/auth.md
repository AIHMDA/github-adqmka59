# Authentication API Endpoints

## POST /auth/register
Register a new user.

### Request
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe",
  "role": "guard"
}
```

### Response
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "guard",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt-token"
}
```

## POST /auth/login
Authenticate a user.

### Request
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Response
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "guard"
  },
  "token": "jwt-token"
}
```

## POST /auth/logout
Invalidate the current session.

### Response
```json
{
  "message": "Successfully logged out"
}
```

## POST /auth/refresh
Refresh the JWT token.

### Request
```json
{
  "refreshToken": "current-refresh-token"
}
```

### Response
```json
{
  "token": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```