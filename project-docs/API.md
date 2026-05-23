# API Documentation

## Authentication Flow
DevScope uses robust JWT-based authentication. The client logs in, receives a standard JWT token string via HTTP response, and stores it securely. For every authenticated request, the `Authorization` header must be provided as `Bearer <token>`.

## Rate Limiting Strategy
- **Public endpoints**: 60 requests per 15 minutes.
- **Authenticated endpoints**: 300 requests per 15 minutes.
- Rate limits are maintained in Redis via incrementing TTL keys keyed by the user's IP (or User ID when authenticated).

---

## 1. Auth Endpoints

### Registration
`POST /api/v1/auth/register`
Creates a new DevScope user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "strongPassword123!",
  "name": "Alex Doe"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbG...",
    "user": {
      "id": "uuid-v4",
      "email": "user@example.com"
    }
  }
}
```

### Login
`POST /api/v1/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "strongPassword123!"
}
```

---

## 2. GitHub Developer Endpoints

### Search Profile
`GET /api/v1/github/:username/profile`

**Headers Required**: `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "profile": {
      "login": "octocat",
      "name": "The Octocat",
      "followers": 1000,
      "public_repos": 10
    },
    "analytics": {
      "totalStars": 240,
      "repoHealthScore": 8.7,
      "skillSummary": "Strong TypeScript open-source contributor."
    }
  }
}
```

### History Retrieval
`GET /api/v1/search/history`

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "query": "octocat",
      "searchedAt": "2026-05-22T10:00:00Z"
    }
  ]
}
```

---

## Standard Error Responses

**Validation Error (400 Bad Request):**
```json
{
  "status": "fail",
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Must be a valid email address." }]
}
```

**Rate Limit Exceeded (429 Too Many Requests):**
```json
{
  "status": "fail",
  "message": "Too many requests, please try again after 15 minutes."
}
```

**API Timeout/Downstream Error (502 Bad Gateway):**
```json
{
  "status": "error",
  "message": "GitHub API limit reached or timeout. Please try again later."
}
```