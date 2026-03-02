# Database Setup Guide - ArthaPath Nepal

## Step 1: Install PostgreSQL

### Windows

1. Download PostgreSQL installer from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Set a password for the `postgres` superuser (remember this!)
   - Keep default port: **5432**
   - Choose Installation Directory (default is fine)
4. Complete the installation

### macOS

```bash
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## Step 2: Create Database and User

### Option A: Using pgAdmin (GUI)

1. Open **pgAdmin** (installed with PostgreSQL on Windows)
2. Right-click **Databases** → Create → Database
3. Name: `arthapath_nepal`
4. Owner: `postgres`
5. Click Save

### Option B: Using psql (Command Line)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE arthapath_nepal;

# Verify creation
\l
```

---

## Step 3: Configure Backend Environment

1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Update `backend/.env` with your database credentials:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_postgres_password
   DB_DATABASE=arthapath_nepal

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
   JWT_REFRESH_EXPIRES_IN=30d

   # Application
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

---

## Step 4: Test Database Connection

1. Start the backend:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Watch for these successful logs:
   ```
   [Nest] ✓ TypeOrmModule dependencies initialized
   [Nest] ✓ Database connected successfully
   ```

3. If you see database connection errors:
   - Verify PostgreSQL is running
   - Check credentials in `.env`
   - Ensure database `arthapath_nepal` exists

---

## Step 5: Verify Tables Created

Run this command to check if tables were auto-created:

```bash
psql -U postgres -d arthapath_nepal

# List tables
\dt

# Exit psql
\q
```

You should see these tables:
- `users`
- `user_preferences`
- `investment_categories`
- `simulation_history`

---

## Step 6: (Optional) Docker Setup

If you prefer Docker instead of local PostgreSQL:

```bash
docker run --name arthapath-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=arthapath_nepal \
  -p 5432:5432 \
  -d postgres:14
```

Then use credentials from `.env`:
```env
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

---

## Troubleshooting

### Error: "Connection refused"
- PostgreSQL is not running
- **Solution:** Start PostgreSQL service

### Error: "Database arthapath_nepal does not exist"
- Database wasn't created
- **Solution:** Run Step 2 again

### Error: "FATAL: password authentication failed"
- Wrong password in `.env`
- **Solution:** Update `DB_PASSWORD` in `.env`

### Error: "Cannot connect on port 5432"
- PostgreSQL running on different port
- **Solution:** Check PostgreSQL port in `.env` or update it

---

## Database Seeding (Coming Next)

After database is connected, we'll create seed scripts to populate:
- Investment categories
- Sample data for testing

---

## Useful PostgreSQL Commands

```bash
# Connect to database
psql -U postgres -d arthapath_nepal

# List all databases
\l

# List all tables
\dt

# Describe a table
\d users

# Drop database (use carefully!)
DROP DATABASE arthapath_nepal;

# Exit
\q
```

---

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database
3. ✅ Update `.env` file
4. ✅ Run backend
5. ⏭️ Create seed data for investment categories
6. ⏭️ Test API endpoints

Need help? Check the logs for specific error messages.
