# User Module - API Documentation

## Overview
Complete user profile and preferences management for ArthaPath Nepal.

## Endpoints

All endpoints require JWT authentication (`Authorization: Bearer <token>`)

### 1. Get User Profile
**GET** `/users/profile`

Returns the current user's profile information.

**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2026-03-02T...",
  "updated_at": "2026-03-02T..."
}
```

**Example:**
```bash
curl -X GET http://localhost:3001/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 2. Update User Profile
**PATCH** `/users/profile`

Update user's name or email.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "created_at": "2026-03-02T...",
  "updated_at": "2026-03-02T..."
}
```

**Errors:**
- `404` - User not found
- `409` - Email already in use

**Example:**
```bash
curl -X PATCH http://localhost:3001/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com"
  }'
```

---

### 3. Get User Preferences
**GET** `/users/preferences`

Get user's investment preferences.

**Response (200):**
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "risk_tolerance": "Medium",
  "liquidity_need": "Low",
  "has_emergency_fund": true,
  "created_at": "2026-03-02T...",
  "updated_at": "2026-03-02T..."
}
```

**Response (200) - No preferences:**
```json
null
```

**Example:**
```bash
curl -X GET http://localhost:3001/users/preferences \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. Create User Preferences
**POST** `/users/preferences`

Create initial user preferences (one-time only).

**Request Body:**
```json
{
  "risk_tolerance": "High",
  "liquidity_need": "Low",
  "has_emergency_fund": true
}
```

**Validation:**
- `risk_tolerance`: Must be "Low", "Medium", or "High"
- `liquidity_need`: Must be "Low", "Medium", or "High"
- `has_emergency_fund`: Must be boolean

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "risk_tolerance": "High",
  "liquidity_need": "Low",
  "has_emergency_fund": true,
  "created_at": "2026-03-02T...",
  "updated_at": "2026-03-02T..."
}
```

**Errors:**
- `404` - User not found
- `409` - Preferences already exist (use PATCH to update)

**Example:**
```bash
curl -X POST http://localhost:3001/users/preferences \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "risk_tolerance": "High",
    "liquidity_need": "Low",
    "has_emergency_fund": true
  }'
```

---

### 5. Update User Preferences
**PATCH** `/users/preferences`

Update existing preferences or create if they don't exist.

**Request Body (all fields optional):**
```json
{
  "risk_tolerance": "Medium",
  "liquidity_need": "High",
  "has_emergency_fund": false
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "risk_tolerance": "Medium",
  "liquidity_need": "High",
  "has_emergency_fund": false,
  "created_at": "2026-03-02T...",
  "updated_at": "2026-03-02T..."
}
```

**Errors:**
- `404` - User not found

**Example:**
```bash
curl -X PATCH http://localhost:3001/users/preferences \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "risk_tolerance": "Medium"
  }'
```

---

## Testing Flow

### Complete User Flow:
```bash
# 1. Register
RESPONSE=$(curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "name": "Test User"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.access_token')

# 2. Get Profile
curl -X GET http://localhost:3001/users/profile \
  -H "Authorization: Bearer $TOKEN"

# 3. Update Profile
curl -X PATCH http://localhost:3001/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }'

# 4. Create Preferences
curl -X POST http://localhost:3001/users/preferences \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "risk_tolerance": "High",
    "liquidity_need": "Low",
    "has_emergency_fund": true
  }'

# 5. Get Preferences
curl -X GET http://localhost:3001/users/preferences \
  -H "Authorization: Bearer $TOKEN"

# 6. Update Preferences
curl -X PATCH http://localhost:3001/users/preferences \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "risk_tolerance": "Medium"
  }'
```

---

## Files Created

```
backend/src/user/
├── user.module.ts              # Module configuration
├── user.service.ts             # Business logic
├── user.controller.ts          # API endpoints
└── dto/
    ├── update-profile.dto.ts   # Profile update validation
    └── preferences.dto.ts      # Preferences validation
```

---

## Integration with Other Modules

### Using User Service in Simulator:
```typescript
import { UserService } from '../user/user.service';

constructor(private userService: UserService) {}

async runSimulation(userId: string) {
  // Get user preferences
  const preferences = await this.userService.getPreferences(userId);
  
  // Use preferences in calculation
  const riskProfile = this.calculateRisk(preferences);
}
```

---

## Security Features

✅ **JWT Authentication Required** - All endpoints protected
✅ **Email Uniqueness** - Prevents duplicate emails
✅ **Password Excluded** - Never returns password in responses
✅ **Input Validation** - class-validator on all inputs
✅ **User Isolation** - Users can only access their own data

---

## Status

✅ User profile retrieval endpoint
✅ User profile update endpoint  
✅ User preferences retrieval endpoint
✅ User preferences creation endpoint
✅ User preferences update endpoint
✅ Input validation with DTOs
✅ JWT authentication guards
✅ TypeScript compilation passing

**Status: 100% COMPLETE**
