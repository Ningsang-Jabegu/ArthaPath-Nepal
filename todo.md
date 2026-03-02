# ArthaPath Nepal - Development Todo List

## PHASE 1: Core Infrastructure & Authentication

### 1. Project Setup
- [✔] Initialize Next.js project with TypeScript and App Router
- [✔] Initialize NestJS backend with TypeScript
- [✔] Configure Tailwind CSS and design tokens
- [✔] Set up PostgreSQL database connection
- [✔] Create project structure (frontend/backend separation)
- [✔] Set up GitHub repository and GitHub Actions CI

### 2. Authentication Module (Backend - NestJS)
- [✔] Create User entity and migration
- [✔] Implement user registration endpoint with validation
- [✔] Implement login endpoint
- [✔] Configure JWT authentication strategy
- [✔] Implement JWT token generation and refresh logic
- [✔] Set up bcrypt for password hashing
- [✔] Create auth guards for protected routes
- [✔] Add rate limiting middleware

### 3. User Module (Backend - NestJS)
- [✔] Create User profile schema (name, email, preferences)
- [✔] Create UserPreference entity (risk tolerance, liquidity need, emergency fund status)
- [✔] Implement user profile retrieval endpoint
- [✔] Implement user profile update endpoint
- [✔] Create endpoint to store user preferences

### 4. Frontend - Authentication Pages & Components
- [✔] Create login page component
- [✔] Create registration page component
- [✔] Create form validation using TypeScript DTOs
- [✔] Implement JWT token storage (localStorage/cookies)
- [✔] Create auth context/provider for global state
- [✔] Set up protected routes middleware
- [✔] Create logout functionality

---

## PHASE 1.5: Design System & Core UI Components

### 5. Design System Setup
- [✔] Define CSS variables for color tokens (dark mode)
- [✔] Define CSS variables for color tokens (light mode)
- [✔] Set up typography scale (H1-H4, Body, Label)
- [✔] Create spacing/grid utility classes
- [✔] Test theme toggle functionality in browser

### 6. Core UI Components (Reusable)
- [✔] Create Header component with logo, navigation, theme toggle, profile menu
- [✔] Create Sidebar component with menu items (Dashboard, Explore, Simulator, Education)
- [✔] Create Card component with variants (Summary, Metric, Chart, Allocation)
- [✔] Create Button component (Primary, Secondary, Danger variants)
- [✔] Create Badge component (Risk level indicators)
- [✔] Create Input component (text, number, with validation)
- [✔] Create Modal component
- [✔] Create Loading skeleton component
- [✔] Ensure all components work in dark and light modes

### 7. Layout Structure
- [✔] Create main layout wrapper (Header + Sidebar + Main Content)
- [✔] Implement responsive breakpoints (desktop, tablet, mobile)
- [✔] Test sidebar collapse on tablet/mobile
- [✔] Create footer component
- [✔] Set up page templates for Dashboard, Explore, Simulator, Education

---

## PHASE 1.6: Data & Risk Engine

### 8. Investment Knowledge Database (Backend)
- [✔] Create InvestmentCategory entity (name, type, returns, risk level, liquidity, lock-in, description)
- [✔] Seed database with investment categories:
  - [✔] Stocks
  - [✔] Mutual Funds
  - [✔] Bonds
  - [✔] Fixed Deposit (FD)
  - [✔] Gold
  - [✔] Real Estate
  - [✔] Business
- [✔] Create endpoint to retrieve all investment categories
- [✔] Create endpoint to filter categories by criteria

### 9. Risk Classification Engine (Backend - NestJS)
- [✔] Create RiskProfile entity (Conservative, Balanced, Aggressive)
- [✔] Implement rule-based scoring algorithm:
  - [✔] Calculate risk score from time horizon
  - [✔] Calculate risk score from liquidity need
  - [✔] Calculate risk score from user-selected risk tolerance
  - [✔] Aggregate scores to determine profile (Conservative/Balanced/Aggressive)
- [✔] Create endpoint to calculate risk profile from user inputs
- [✔] Write unit tests for risk scoring logic

### 10. Allocation Engine (Backend - NestJS)
- [✔] Create AllocationMatrix entity (risk profile → percentage allocation per category)
- [✔] Define allocation rules:
  - [✔] Conservative profile allocations
  - [✔] Balanced profile allocations
  - [✔] Aggressive profile allocations
- [✔] Implement allocation calculation logic:
  - [✔] Apply time-horizon adjustment to base allocation
  - [✔] Calculate capital distribution per category
  - [✔] Create endpoint to generate allocation plan
- [ ] Write unit tests for allocation logic

### 11. Projection Engine (Backend - NestJS)
- [✔] Implement compound interest formula:
  - [✔] Future Value = P(1+r)^t + Monthly Contribution Growth
- [✔] Create ProjectionResult entity (conservative, expected, optimistic)
- [✔] Implement projection calculation:
  - [✔] Calculate using conservative return rate
  - [✔] Calculate using expected return rate
  - [✔] Calculate using optimistic return rate
  - [✔] Include initial capital + monthly contributions
  - [✔] Return total contributions and estimated gains
- [✔] Create endpoint to generate projections
- [ ] Write unit tests for projection calculations

---

## PHASE 1.7: User Financial Input Module (Frontend & Backend)

### 12. Input Form - Backend Validation
- [✔] Create UserInputDTO with validation rules:
  - [✔] Total investment capital (required, numeric, min/max)
  - [✔] Monthly recurring investment (optional, numeric, min/max)
  - [✔] Investment duration (required, in years, 1-50)
  - [✔] Risk tolerance (required, Low/Medium/High)
  - [✔] Liquidity need (required, Low/Medium/High)
  - [✔] Emergency fund status (required, Yes/No)
- [✔] Implement backend validation endpoint
- [✔] Create SimulationHistory entity to store inputs

### 13. Input Form - Frontend Component
- [ ] Create multi-step form component:
  - [ ] Step 1: Capital input fields
  - [ ] Step 2: Risk tolerance selector
  - [ ] Step 3: Timeline & liquidity inputs
  - [ ] Step 4: Review & submit
- [ ] Implement client-side form validation
- [ ] Create form error messaging
- [ ] Add helpful tooltips/descriptions for each field
- [ ] Implement form data persistence (prevent data loss)

### 14. Form Submission & Risk Calculation Flow
- [✔] Create API call to submit user input
- [✔] Integrate with risk classification engine
- [✔] Integrate with allocation engine
- [✔] Integrate with projection engine
- [✔] Store simulation history in database
- [ ] Handle API errors gracefully

---

## PHASE 1.8: Dashboard Page & Initial Charts

### 15. Chart Components Setup
- [ ] Install and configure Recharts
- [ ] Create LineChart component for projection growth (conservative/expected/optimistic)
- [ ] Create PieChart component for allocation breakdown
- [ ] Create BarChart component for scenario comparison
- [ ] Ensure all charts are dark/light mode compatible
- [ ] Add chart legends and tooltips

### 16. Dashboard Page Layout
- [ ] Create Dashboard page component
- [ ] Add Summary Cards:
  - [ ] Total Capital card
  - [ ] Risk Profile card (badge + label)
  - [ ] Monthly Contribution card
  - [ ] Duration card
- [ ] Add Metric Cards:
  - [ ] Projected Value (5 Years) with % growth
  - [ ] Total Contributions
  - [ ] Estimated Gain
- [ ] Add Allocation Card with PieChart
- [ ] Add Projection Chart (LineChart) with three scenarios
- [ ] Add placeholder for AI Explanation panel

---

## PHASE 2: AI Integration & Advanced Features

### 17. AI Explanation Module (Backend)
- [ ] Set up OpenAI API integration
- [ ] Create prompt templates for:
  - [ ] Allocation explanation
  - [ ] Risk profile reasoning
  - [ ] Time-horizon context
  - [ ] Educational narrative
- [ ] Implement request to AI with allocation + projection data
- [ ] Add disclaimer injection to all AI responses
- [ ] Create endpoint to generate AI explanations
- [ ] Add response caching to reduce API calls
- [ ] Write tests to ensure no price predictions in output

### 18. AI Explanation UI (Frontend)
- [ ] Create ExplanationPanel component
- [ ] Display AI-generated text in formatted markdown
- [ ] Add loading state during API call
- [ ] Implement error fallback (non-AI explanation)
- [ ] Add disclaimer badge/footer to explanation

### 19. Save Plan Feature (Backend)
- [ ] Create SavedPlan entity (user_id, allocation_data, projection_data, created_at)
- [ ] Implement endpoint to save plan
- [ ] Implement endpoint to retrieve saved plans
- [ ] Implement endpoint to delete saved plans
- [ ] Add plan metadata (name, date saved)

### 20. Save Plan UI (Frontend)
- [ ] Add "Save This Plan" button on dashboard
- [ ] Create save plan modal/dialog
- [ ] Allow user to name the plan
- [ ] Show confirmation after save
- [ ] Display list of saved plans (on profile/dashboard)

---

## PHASE 2.1: Investment Simulator

### 21. Simulator Page - Backend API
- [ ] Create endpoint to accept dynamic input changes
- [ ] Real-time recalculation of risk profile on input change
- [ ] Real-time recalculation of allocation on input change
- [ ] Real-time recalculation of projection on input change
- [ ] Return updated results without page reload

### 22. Simulator Page - Frontend
- [ ] Create Simulator page layout
- [ ] Implement adjustable input panel:
  - [ ] Slider for capital amount
  - [ ] Slider for monthly contribution
  - [ ] Dropdown for duration (1-50 years)
  - [ ] Slider for risk tolerance (Low-Medium-High)
- [ ] Implement live-updating projection chart
- [ ] Display allocation breakdown with pie chart
- [ ] Add scenario comparison table (Conservative/Expected/Optimistic)
- [ ] Add "Reset to default" button

### 23. Simulator Interactions
- [ ] Debounce input changes to prevent excessive API calls
- [ ] Show loading state during recalculation
- [ ] Animate chart updates smoothly
- [ ] Update all cards/charts in real-time
- [ ] Track simulator interactions for analytics

---

## PHASE 2.2: Educational Module

### 24. Education Module - Content & Database (Backend)
- [ ] Create EducationArticle entity (title, category, content, risk_icon, image)
- [ ] Create articles for each investment category:
  - [ ] Stocks - What it is, how it works in Nepal, risks, pros/cons, suitable profiles, worst-case
  - [ ] Mutual Funds - (same structure)
  - [ ] Bonds - (same structure)
  - [ ] Fixed Deposit - (same structure)
  - [ ] Gold - (same structure)
  - [ ] Real Estate - (same structure)
  - [ ] Business - (same structure)
- [ ] Create general education articles:
  - [ ] Risk & Diversification
  - [ ] Compound Interest Explained
  - [ ] Time Horizon Importance
  - [ ] Emergency Fund Best Practices
- [ ] Create endpoint to retrieve all articles
- [ ] Create endpoint to filter articles by category

### 25. Education Page - Frontend
- [ ] Create Education page layout
- [ ] Display article cards in grid:
  - [ ] Title
  - [ ] Category tag
  - [ ] Risk icon indicator
  - [ ] Brief preview
  - [ ] "Read More" button
- [ ] Implement category filter
- [ ] Implement search functionality
- [ ] Create article detail page
- [ ] Format article content with proper typography

---

## PHASE 2.3: Explore Page

### 26. Explore Page - Backend API
- [ ] Create endpoint to list all investment opportunities
- [ ] Implement filtering by:
  - [ ] Risk level
  - [ ] Investment type
  - [ ] Duration/lock-in period
  - [ ] Liquidity score
- [ ] Implement sorting options (by risk, return, liquidity)

### 27. Explore Page - Frontend
- [ ] Create Explore page layout
- [ ] Implement search bar component
- [ ] Create filter panel:
  - [ ] Risk level checkboxes
  - [ ] Type filter
  - [ ] Duration filter
  - [ ] Liquidity filter
- [ ] Display investment cards in list/grid view
- [ ] Show key metrics per investment:
  - [ ] Expected return range
  - [ ] Risk level
  - [ ] Liquidity score
  - [ ] Minimum capital
  - [ ] Lock-in period
- [ ] Add toggle between list and grid view

---

## PHASE 3: Admin & Analytics

### 28. Admin Dashboard (Backend)
- [ ] Create admin routes (protected by role-based auth)
- [ ] Create endpoint to manage investment categories
- [ ] Create endpoint to add/edit/delete categories
- [ ] Create endpoint to view usage analytics

### 29. Admin Dashboard (Frontend)
- [ ] Create admin panel pages:
  - [ ] Investment categories management
  - [ ] User statistics
  - [ ] Simulator usage analytics
- [ ] Implement CRUD forms for investment categories
- [ ] Display analytics charts (user signups, simulator completions, etc.)

### 30. Analytics & Monitoring Setup
- [ ] Integrate PostHog for user behavior tracking
- [ ] Track simulator completion rate
- [ ] Track allocation plan exports
- [ ] Track education page engagement
- [ ] Track user drop-off points
- [ ] Integrate Sentry for error tracking
- [ ] Set up basic server logging

---

## PHASE 3.1: Data Automation & Compliance

### 31. Data Management
- [ ] Document data seeding process for investment categories
- [ ] Create scripts for manual data verification
- [ ] Set up data validation checks
- [ ] Create audit trail for data updates

### 32. Legal & Compliance
- [ ] Add disclaimer banner: "This platform does not provide financial advice"
- [ ] Create Terms of Service page
- [ ] Create Privacy Policy page
- [ ] Add risk warning modals/badges throughout app
- [ ] Ensure no guaranteed return messaging
- [ ] Document compliance against SEBON regulations (future audit)

---

## PHASE 3.2: Performance & Optimization

### 33. Performance Optimization
- [ ] Implement Server-Side Rendering (SSR) for SEO pages
- [ ] Add static page caching (education pages)
- [ ] Implement lazy loading for charts
- [ ] Add database indexing on user_id and created_at
- [ ] Optimize API response payloads
- [ ] Set up CDN for static assets (future)

### 34. Testing & QA
- [ ] Write unit tests for risk calculation logic (80%+ coverage)
- [ ] Write unit tests for allocation logic (80%+ coverage)
- [ ] Write unit tests for projection logic (80%+ coverage)
- [ ] Write integration tests for API endpoints
- [ ] Write E2E tests for critical user flows:
  - [ ] Registration → Input → Dashboard
  - [ ] Simulator workflow
  - [ ] Save plan workflow
- [ ] Manual testing of dark/light mode switching
- [ ] Mobile responsiveness testing

---

## PHASE 4: Deployment & Launch (Post-MVP)

### 35. DevOps & Deployment
- [ ] Create Docker configuration for backend
- [ ] Set up environment variables for all environments (dev, staging, prod)
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway/Render (MVP) or DigitalOcean (future)
- [ ] Set up managed PostgreSQL database
- [ ] Configure HTTPS and security headers
- [ ] Set up automated backups for database

### 36. Launch Preparation
- [ ] Create landing page/marketing site
- [ ] Write SEO meta tags for all pages
- [ ] Create demo/tutorial videos
- [ ] Set up user onboarding flow
- [ ] Create help/FAQ documentation
- [ ] Soft launch for beta testing
- [ ] Gather feedback and iterate

---

## Future Roadmap (Post-MVP)

### 37. Portfolio Tracking
- [ ] Create portfolio entity to store user investments
- [ ] Implement portfolio update endpoints
- [ ] Create portfolio view/dashboard page
- [ ] Track portfolio vs. projection comparison

### 38. Live Market Data Integration
- [ ] Research available Nepal market data APIs
- [ ] Integrate real-time stock prices (if available)
- [ ] Integrate mutual fund NAV data
- [ ] Implement live data refresh mechanism

### 39. Advanced Features
- [ ] Personal investment alerts/notifications
- [ ] Broker integration for semi-automated execution
- [ ] Advanced ML modeling for better projections
- [ ] Remittance-specific investment planning
- [ ] Mobile app version
- [ ] Multi-language support

---

## Legend
- [ ] - Uncompleted task
- [✔] - Completed task
