# Database Setup Instructions

## Option 1: Install PostgreSQL Locally

### Windows
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. Set password for postgres user
4. Keep default port 5432
5. Install pgAdmin (GUI tool)

### After Installation
1. Open pgAdmin or use psql command line
2. Create database:
   ```sql
   CREATE DATABASE arthapath_nepal;
   ```

## Option 2: Use Docker (Recommended for Development)

```bash
docker run --name arthapath-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=arthapath_nepal -p 5432:5432 -d postgres:14
```

## Verify Connection

Test connection with psql:
```bash
psql -h localhost -U postgres -d arthapath_nepal
```

## Update Backend .env

Make sure your backend/.env matches your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=arthapath_nepal
```

## Database Schema

The backend will auto-create tables on first run (synchronize: true in development).

Tables created:
- users
- user_preferences
- investment_categories
- simulation_history

## Seed Data (Coming Soon)

We'll create seed scripts to populate:
- Investment categories (Stocks, Mutual Funds, Bonds, FD, Gold, Real Estate, Business)
- Sample data for testing
