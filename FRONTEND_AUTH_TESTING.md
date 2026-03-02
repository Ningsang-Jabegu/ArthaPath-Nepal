# Frontend Authentication - Testing & Integration Guide

## Quick Start

### Prerequisites
1. Backend running on `http://localhost:3001`
2. Frontend running on `http://localhost:3000`
3. PostgreSQL database configured
4. `.env` file in frontend root with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

### Files Quick Reference

| File | Purpose | Location |
|------|---------|----------|
| Auth Context | Global state management | `src/context/auth-context.tsx` |
| API Client | HTTP requests + token refresh | `src/lib/api.ts` |
| Validation | Form validation logic | `src/lib/validation.ts` |
| Login Page | Login UI + form handling | `app/login/page.tsx` |
| Register Page | Registration UI + form handling | `app/register/page.tsx` |
| Dashboard | Protected page example | `app/dashboard/page.tsx` |
| Protected Route | Route guard component | `src/components/protected-route.tsx` |
| Form Input | Reusable input component | `src/components/form-input.tsx` |
| Form Button | Reusable button component | `src/components/auth-form-button.tsx` |

## Testing Workflows

### 1. Registration Flow ✅

**Steps:**
1. Navigate to `http://localhost:3000/register`
2. Fill in form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "SecurePass123"
3. Check "I agree to Terms" checkbox
4. Click "Create Account"

**Expected Results:**
- Form validates (no errors if valid input)
- API call to `POST /auth/register`
- Tokens stored in localStorage:
  - `localStorage.getItem('access_token')`
  - `localStorage.getItem('refresh_token')`
- User data in context: `{ id, email, name, created_at, updated_at }`
- Redirects to `/dashboard`
- Dashboard shows user info

**Browser DevTools Checks:**
```javascript
// In Console:
localStorage.getItem('access_token')  // Should show JWT token
localStorage.getItem('refresh_token') // Should show refresh token
```

### 2. Login Flow ✅

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Fill in form:
   - Email: "john@example.com"
   - Password: "SecurePass123"
3. Click "Sign In"

**Expected Results:**
- Form validates
- API call to `POST /auth/login`
- Same token storage as registration
- Redirects to `/dashboard`
- Dashboard shows correct user info

### 3. Protected Route (Logout) ✅

**Steps:**
1. Logged in on dashboard
2. Click "Logout" button in top-right

**Expected Results:**
- Tokens cleared from localStorage
- User context cleared
- Redirects to `/login`
- Navigate to `/dashboard` → auto-redirects to `/login`

**Browser DevTools Checks:**
```javascript
// After logout:
localStorage.getItem('access_token')   // Should be null
localStorage.getItem('refresh_token')  // Should be null
```

### 4. Form Validation ✅

#### Login Form Errors

| Input | Error Message |
|-------|---------------|
| Empty email | "Email is required" |
| Invalid format: "test" | "Please enter a valid email" |
| Empty password | "Password is required" |
| Password: "123" (< 8 chars) | "Password must be at least 8 characters" |

**Test Steps:**
1. Go to login page
2. Try empty email → should show "Email is required"
3. Try "notanemail" → should show "Please enter a valid email"
4. Try short password → should show minimum length error
5. Click submit with errors → should NOT call API

#### Register Form Errors

| Input | Error Message |
|-------|---------------|
| Empty name | "Name is required" |
| Name: "A" (1 char) | "Name must be at least 2 characters" |
| Name: 101+ chars | "Name must not exceed 100 characters" |
| Unchecked terms | "You must agree to the terms and conditions" |
| Email errors | Same as login form |
| Password errors | Same as login form |

### 5. Token Refresh ✅

**Test Steps:**
1. Login successfully
2. Open DevTools → Application → localStorage
3. Copy `access_token` value
4. Go to any page that uses API (like dashboard)
5. Manually delete `access_token` from localStorage (keep refresh_token)
6. Refresh page or make an API call
7. Wait for request to complete

**Expected Results:**
- System detects missing access_token (401 response)
- Auto-uses refresh_token to get new access_token
- New token stored in localStorage
- Request retries automatically
- User sees no error

**Browser DevTools Checks:**
```javascript
// Before logout:
localStorage.getItem('access_token')  // Old token

// After page refresh and auto-refresh:
localStorage.getItem('access_token')  // New token (different value)
```

### 6. API Integration ✅

#### Network Tab in DevTools

**Registration Request:**
```
POST http://localhost:3001/api/auth/register
Headers:
  Content-Type: application/json
Body:
  { "email": "user@example.com", "password": "pass", "name": "User" }
Response:
  { "access_token": "...", "refresh_token": "...", "user": {...} }
```

**Login Request:**
```
POST http://localhost:3001/api/auth/login
Headers:
  Content-Type: application/json
Body:
  { "email": "user@example.com", "password": "pass" }
Response:
  { "access_token": "...", "refresh_token": "...", "user": {...} }
```

**Protected Request (Dashboard):**
```
GET http://localhost:3001/api/auth/me
Headers:
  Authorization: Bearer eyJhbGciOi...
Response:
  { "id": "...", "email": "...", "name": "...", "created_at": "...", "updated_at": "..." }
```

## Common Issues & Solutions

### Issue: "Cannot GET /login"
**Solution:** Make sure frontend is running (`npm run dev` in frontend folder)

### Issue: "Unauthorized" on login
**Possible Causes:**
- Backend not running on `http://localhost:3001`
- CORS issues - check backend CORS configuration
- API endpoint path mismatch
- Wrong credentials

**Debug:**
1. Check Network tab in DevTools
2. Verify request URL: `http://localhost:3001/api/auth/login`
3. Check response status: should be 200 on success, 401 on bad credentials
4. Verify backend is listening: `curl http://localhost:3001/api/auth/login -X OPTIONS`

### Issue: "Session expired" error
**Solution:** This is expected when refresh token expires. User should:
1. Logout
2. Login again to get fresh tokens

### Issue: Token not persisting after page refresh
**Possible Causes:**
- localStorage disabled in browser
- Private/Incognito mode (different storage)
- Browser cache issue

**Debug:**
1. Check if localStorage is enabled: `typeof(Storage) !== "undefined"`
2. Try clearing browser cache
3. Try regular browsing mode (not incognito)

### Issue: Dark mode not working
**Solution:** Add `suppressHydrationWarning` to `<html>` tag in layout.tsx (already done)

## Debugging Commands

### Check Auth Context State
```javascript
// In browser console (needs React DevTools):
// Right-click on component → Inspect
// Go to Components tab in React DevTools
// Find AuthProvider
// Check context value in props
```

### Monitor API Calls
```javascript
// Add to api.ts for debugging (temporary):
console.log('API Call:', endpoint, options);
console.log('Response:', data);
console.log('Tokens:', { 
  access: localStorage.getItem('access_token')?.substring(0, 20) + '...',
  refresh: localStorage.getItem('refresh_token')?.substring(0, 20) + '...'
});
```

### Test Token Validation
```javascript
// Decode JWT token (in console):
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

parseJwt(localStorage.getItem('access_token'));
// Output: { userId: "...", email: "...", iat: ..., exp: ... }
```

## Environment Configuration

### Frontend .env File
```
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Only use NEXT_PUBLIC_* variables in frontend
# They are embedded in browser bundle
```

### Backend .env File (Reference)
```
# JWT Configuration
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=finance_investor

# Server
PORT=3001
NODE_ENV=development
```

## Performance Considerations

1. **Auth Check on Mount**: Happens once when app loads
2. **Context Updates**: Only re-render when auth state changes
3. **Form Validation**: Client-side before API call (saves requests)
4. **Token Refresh**: Automatic and transparent to user
5. **Loading States**: Spinner shown during async operations

## Security Checklist

- [✔] Passwords minimum 8 characters
- [✔] Tokens stored in localStorage
- [✔] Bearer token in Authorization header
- [✔] Automatic token refresh on 401
- [✔] Protected routes guard unauthorized access
- [✔] Error messages don't leak sensitive info
- [✔] CORS configured on backend
- [✔] HTTPS ready (just change protocol in .env)

## Next Steps After Testing

1. **Fix any issues** found during testing
2. **Set up PostgreSQL** if not already done
3. **Test with real backend** data
4. **Implement additional features**:
   - User profile page
   - Password reset flow
   - Email verification
   - Two-factor authentication
5. **Deploy to production**:
   - Update `NEXT_PUBLIC_API_URL` to production backend
   - Enable HTTPS
   - Set secure cookie flags

## Support Information

All components include JSDoc comments for developer reference.

For TypeScript support, all types are in `src/types/auth.ts`.

For API documentation, see `USER_MODULE_API.md` and `AUTH_TESTING.md` in backend folder.
