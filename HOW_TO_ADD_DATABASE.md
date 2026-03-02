# How to Add PostgreSQL Database - Quick Guide

## ⚡ Fastest Way (Using Docker - 2 Minutes)

If you have Docker installed:

```bash
docker run --name arthapath-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=arthapath_nepal \
  -p 5432:5432 \
  -d postgres:14
```

✅ Done! Your database is running.

---

## 📦 Install PostgreSQL Locally

### Windows

1. Download: https://www.postgresql.org/download/windows/
2. Run installer
3. Set password during installation
4. Keep port: **5432**
5. Complete installation

### macOS

```bash
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## 🗄️ Create Database (One-Time Setup)

After PostgreSQL is installed and running:

### Using Command Line (psql)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE arthapath_nepal;

# Check it was created
\l

# Exit
\q
```

### Using pgAdmin GUI (Windows)

1. Open pgAdmin (comes with PostgreSQL)
2. Right-click **Databases** → **Create** → **Database**
3. Name: `arthapath_nepal`
4. Owner: `postgres`
5. Click **Save**

---

## 🔧 Configure Backend (.env)

```bash
cd backend

# Copy the example file
cp .env.example .env

# Edit .env (open in any text editor)
```

Update these values:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres              # ← Your PostgreSQL password
DB_DATABASE=arthapath_nepal

# JWT (keep as is for development)
JWT_SECRET=dev_jwt_secret_change_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=dev_jwt_refresh_secret_change_in_production
JWT_REFRESH_EXPIRES_IN=30d

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## ✅ Test Connection

Start the backend:

```bash
cd backend
npm run start:dev
```

✅ **Success** - You'll see:
```
[Nest] ✓ TypeOrmModule dependencies initialized
[Nest] ✓ Starting Nest application...
🚀 Backend running on http://localhost:3001
```

❌ **Error** - Check:
- Is PostgreSQL running?
- Is password correct in `.env`?
- Does database `arthapath_nepal` exist?

---

## 🧪 Verify Everything Works

Test the simulator API:

```bash
curl -X POST http://localhost:3001/simulator/run \
  -H "Content-Type: application/json" \
  -d '{
    "initial_capital": 100000,
    "monthly_contribution": 5000,
    "duration_years": 10,
    "risk_tolerance": "Medium",
    "liquidity_need": "Low",
    "has_emergency_fund": true
  }'
```

✅ You should get a JSON response with projections!

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" | PostgreSQL not running - start it |
| "Database does not exist" | Run `CREATE DATABASE arthapath_nepal;` |
| "Password authentication failed" | Update `DB_PASSWORD` in `.env` |
| "FATAL: Ident authentication failed" (Linux) | Use `sudo -u postgres psql` |
| Tables not created | Backend creates them automatically |

---

## 📊 Check Database Manually

```bash
# Connect
psql -U postgres -d arthapath_nepal

# List tables (should show 4)
\dt

# View table structure
\d users
\d investment_categories
\d simulation_history
\d user_preferences

# Exit
\q
```

---

## 🚀 You're Done!

- ✅ PostgreSQL installed
- ✅ Database created
- ✅ Backend configured
- ✅ Connection tested

Proceed to: `npm run dev` in frontend directory →

---

## Useful Commands

```bash
# Restart PostgreSQL (if it crashes)
# Windows: Services → PostgreSQL → Restart
# macOS: brew services restart postgresql@14
# Linux: sudo systemctl restart postgresql

# See all databases
psql -U postgres -l

# See active connections
psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# Backup database
pg_dump -U postgres arthapath_nepal > backup.sql

# Restore database
psql -U postgres arthapath_nepal < backup.sql

# Reset database (careful!)
dropdb -U postgres arthapath_nepal
createdb -U postgres arthapath_nepal
```

---

## Questions?

Check: `DATABASE_SETUP_GUIDE.md` for detailed information
