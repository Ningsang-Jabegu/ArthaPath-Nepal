# SavedPlan Module

## Overview
The SavedPlan module allows authenticated users to save, retrieve, update, and delete their investment allocation plans. Each saved plan stores complete financial projections, risk profiles, allocation strategies, and user inputs.

## Features
- **Save Plans**: Users can save multiple investment plans with custom names and descriptions
- **Retrieve Plans**: Get all saved plans or a specific plan by ID
- **Update Plans**: Modify plan name and description (financial data remains immutable)
- **Delete Plans**: Remove unwanted plans
- **Plan Count**: Get statistics on number of saved plans
- **User Isolation**: Each user can only access their own plans

## Database Schema

### SavedPlan Entity
```typescript
{
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key to users table)
  plan_name: string (Required, max 255 chars)
  description: string (Optional, max 500 chars)
  
  // Financial Input
  initial_capital: number
  monthly_contribution: number
  duration_years: number
  risk_tolerance: 'Low' | 'Medium' | 'High'
  liquidity_need: 'Low' | 'Medium' | 'High'
  has_emergency_fund: boolean
  
  // Calculated Results
  risk_profile: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'
  allocation: JSON (e.g., { stocks: 40, bonds: 30, gold: 20, fd: 10 })
  capital_distribution: JSON (e.g., { stocks: 40000, bonds: 30000, gold: 20000, fd: 10000 })
  projection: JSON {
    conservative: number
    expected: number
    optimistic: number
    total_contributions: number
  }
  
  created_at: timestamp
  updated_at: timestamp
}
```

## API Endpoints

### 1. Save a New Plan
**POST** `/saved-plans`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "plan_name": "My Retirement Plan",
  "description": "Long-term retirement savings strategy",
  "initial_capital": 100000,
  "monthly_contribution": 5000,
  "duration_years": 10,
  "risk_tolerance": "Medium",
  "liquidity_need": "Low",
  "has_emergency_fund": true,
  "risk_profile": "BALANCED",
  "allocation": {
    "stocks": 40,
    "bonds": 30,
    "gold": 20,
    "fd": 10
  },
  "capital_distribution": {
    "stocks": 40000,
    "bonds": 30000,
    "gold": 20000,
    "fd": 10000
  },
  "projection": {
    "conservative": 150000,
    "expected": 200000,
    "optimistic": 250000,
    "total_contributions": 120000
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "plan_name": "My Retirement Plan",
  "description": "Long-term retirement savings strategy",
  ...
  "created_at": "2026-03-04T10:00:00Z",
  "updated_at": "2026-03-04T10:00:00Z"
}
```

### 2. Get All User Plans
**GET** `/saved-plans`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "plan_name": "My Retirement Plan",
    ...
  },
  {
    "id": "uuid",
    "plan_name": "Education Fund",
    ...
  }
]
```

### 3. Get Plan by ID
**GET** `/saved-plans/:id`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response:** `200 OK` (same as save response)

**Error Responses:**
- `404 Not Found`: Plan does not exist
- `403 Forbidden`: Plan belongs to another user

### 4. Update Plan Metadata
**PATCH** `/saved-plans/:id`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Request Body:**
```json
{
  "plan_name": "Updated Plan Name",
  "description": "Updated description"
}
```

**Response:** `200 OK` (updated plan object)

**Error Responses:**
- `404 Not Found`: Plan does not exist
- `403 Forbidden`: Plan belongs to another user

### 5. Delete Plan
**DELETE** `/saved-plans/:id`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found`: Plan does not exist
- `403 Forbidden`: Plan belongs to another user

### 6. Get Plan Count
**GET** `/saved-plans/stats/count`

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Response:** `200 OK`
```json
{
  "count": 5
}
```

## Security
- **Authentication Required**: All endpoints require valid JWT token
- **Authorization**: Users can only access their own plans
- **Cascade Delete**: Plans are automatically deleted when user is deleted
- **Data Validation**: All inputs are validated using class-validator DTOs

## Testing

### Run Unit Tests
```bash
npm test -- saved-plan.service.spec
```

**Test Coverage:**
- ✅ 15/15 tests passing
- Save plan functionality
- Retrieve all plans
- Get plan by ID with ownership validation
- Update plan metadata
- Delete plan with ownership validation
- Get plan count

### Manual API Testing
Use tools like Postman or curl:

```bash
# 1. Login to get token
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Save a plan
curl -X POST http://localhost:3001/saved-plans \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d @plan-data.json

# 3. Get all plans
curl http://localhost:3001/saved-plans \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

## Implementation Details

### Service Methods
- `savePlan()`: Create and save new plan
- `getUserPlans()`: Get all plans for authenticated user (sorted by created_at DESC)
- `getPlanById()`: Get specific plan with ownership check
- `updatePlan()`: Update only metadata fields
- `deletePlan()`: Delete plan with ownership check
- `getUserPlanCount()`: Get count of user's plans

### DTOs
- `SavePlanDto`: Validation for creating new plan
- `UpdatePlanDto`: Validation for updating plan metadata
- `SavedPlanResponseDto`: Consistent response structure

## Future Enhancements
- [ ] Plan sharing functionality
- [ ] Plan versioning/history
- [ ] Export plans to PDF
- [ ] Plan comparison feature
- [ ] Pagination for large plan lists
- [ ] Search and filter functionality
