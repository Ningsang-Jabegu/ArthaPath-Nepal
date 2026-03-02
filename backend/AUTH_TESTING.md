# Authentication Module Test Guide

## Running Tests

### Run all E2E tests:
```bash
npm run test:e2e
```

### Run authentication tests specifically:
```bash
npm run test:e2e -- auth.e2e-spec.ts
```

## Manual Testing with cURL

### 1. Register a new user:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### 2. Login:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Get current user profile:
```bash
curl -X GET http://localhost:3001/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Refresh token:
```bash
curl -X POST http://localhost:3001/auth/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN"
```

## Testing Protected Routes

The `/simulator/run` endpoint should now accept authentication:

```bash
curl -X POST http://localhost:3001/simulator/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "initial_capital": 100000,
    "monthly_contribution": 5000,
    "duration_years": 10,
    "risk_tolerance": "Medium",
    "liquidity_need": "Low",
    "has_emergency_fund": true
  }'
```

## Rate Limiting Test

Try making more than 10 requests per minute to any endpoint:

```bash
for i in {1..15}; do
  curl -X POST http://localhost:3001/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "password123"
    }'
  echo "Request $i completed"
done
```

**Expected:** Requests 11-15 should return `429 Too Many Requests`

## Validation Tests

### Invalid email format:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123",
    "name": "Test User"
  }'
```

**Expected:** `400 Bad Request` with validation error

### Short password:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "password": "short",
    "name": "Test User"
  }'
```

**Expected:** `400 Bad Request` - "Password must be at least 8 characters"

### Duplicate email:
```bash
# Register first user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Try to register again with same email
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "password123",
    "name": "Test User 2"
  }'
```

**Expected:** `409 Conflict` - "User with this email already exists"

## Features Implemented

✅ User registration with validation
✅ User login with JWT tokens
✅ Password hashing with bcrypt
✅ JWT authentication strategy
✅ Refresh token support
✅ Protected routes with JWT guards
✅ Rate limiting (10 requests/minute)
✅ Current user endpoint
✅ Global validation pipes
✅ Proper error handling

## Security Notes

1. **JWT Secrets**: Change `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env` for production
2. **Token Expiry**: Access tokens expire in 7 days, refresh tokens in 30 days
3. **Password Hashing**: bcrypt with 10 salt rounds
4. **Rate Limiting**: 10 requests per minute per IP
5. **CORS**: Only allows requests from frontend URL

## Next Steps

- Add email verification
- Implement forgot password flow
- Add two-factor authentication (2FA)
- Implement user profile update endpoints
- Add user preferences endpoints
