# ArthaPath Nepal

> Investment Intelligence Platform for Nepal

## Project Structure

```
Finance Investor/
├── frontend/          # Next.js frontend (TypeScript + Tailwind)
├── backend/           # NestJS backend (TypeScript + PostgreSQL)
├── prd                # Product Requirements Document
├── desing doc         # Design Document
├── tech stack         # Tech Stack & Architecture Document
└── todo.md            # Development checklist
```

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

## Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

Create a database named `arthapath_nepal`:

```sql
CREATE DATABASE arthapath_nepal;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=arthapath_nepal
```

### 4. Run the backend

```bash
npm run start:dev
```

Backend will run on `http://localhost:3001`

## Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Run the frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Simulator

**POST** `/simulator/run`

Run investment simulation

**Request Body:**
```json
{
  "initial_capital": 100000,
  "monthly_contribution": 10000,
  "duration_years": 10,
  "risk_tolerance": "Medium",
  "liquidity_need": "Low",
  "has_emergency_fund": true
}
```

**Response:**
```json
{
  "risk_profile": "Balanced",
  "allocation": {
    "Mutual Fund": 35,
    "Stocks": 25,
    "Fixed Deposit": 20,
    "Bonds": 10,
    "Gold": 10,
    "Real Estate": 0,
    "Business": 0
  },
  "capital_distribution": {
    "Mutual Fund": 35000,
    "Stocks": 25000,
    ...
  },
  "projection": {
    "conservative": 450000,
    "expected": 550000,
    "optimistic": 650000,
    "total_contributions": 220000,
    ...
  },
  "yearly_projection": [...]
}
```

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI / ShadCN UI
- **Charts:** Recharts

### Backend
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Validation:** class-validator
- **Auth:** JWT (coming soon)

## Development Status

✅ Phase 1 Started:
- Project structure initialized
- Backend core engines implemented (Risk, Allocation, Projection)
- Database entities created
- Simulator API endpoint functional
- Design tokens configured

🔄 Next Steps:
- Frontend UI components
- Dashboard page with charts
- Authentication system
- Investment database seeding

## Scripts

### Backend
```bash
npm run start        # Start production
npm run start:dev    # Start development with watch
npm run build        # Build for production
npm run test         # Run unit tests
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## Contributing

This is a private project. See the PRD and design docs for feature requirements.

## License

Private - All rights reserved
