# Tegagn (ጠጋኝ) — Full Build Guide: Figma → Deployment

**Stack assumption:** React (frontend) + Node.js/Express (backend) + MongoDB — the standard combo Google Antigravity handles well. If you want Next.js instead of plain React, swap it in step 3's prompt.

---

## STEP 1 — Design in Figma

Open Figma → use **First Draft / Figma AI** (or a blank file if generating manually) → paste this prompt:

```
Design a mobile-first web app called "Tegagn" (ጠጋኝ) — a service 
marketplace that connects customers with home-service providers 
(plumbers, electricians, builders, painters, cleaners) in Ethiopia. 
Solve the core problems of unclear provider availability and 
inconsistent pricing.

STYLE DIRECTION
- Modern, clean, trustworthy — think Uber/Bolt meets TaskRabbit
- Primary color: deep blue (#1E40AF) for trust
- Accent color: warm orange (#F97316) for CTAs and "available now" states
- Neutral grays for backgrounds, white cards with soft shadows
- Rounded corners (12-16px), generous whitespace, no clutter
- Typography: clean sans-serif (Inter or similar), bold headings
- Icons: outline style, consistent stroke weight

CORE SCREENS TO DESIGN

1. Onboarding (3 slides): explain the problem (unreliable fixers, 
   unclear pricing) → solution (verified providers, live availability, 
   upfront pricing) → CTA to sign up

2. Auth: Sign up / Log in with phone number, role selection 
   (Customer or Provider)

3. Home / Browse (Customer): 
   - Search bar + category chips (Plumbing, Electrical, Construction, 
     Painting, Cleaning, etc.) with icons
   - Provider cards: photo, name, category, rating, price range, 
     availability badge (green "Available Now" / gray "Busy" / 
     "Available [date]")
   - Filter/sort bar: distance, rating, price, availability

4. Provider Profile (Customer view): photo, bio, category, skills, 
   rating + reviews, price range, availability calendar, past work 
   photos, "Request Service" CTA button

5. Post a Job (Customer): category, description, photo upload, 
   location, urgency (Now / Schedule for later), budget range

6. Job Request Flow: customer sends request → status screen 
   (Pending → Provider Responded with Quote → Accepted → In Progress 
   → Completed)

7. Provider Dashboard: incoming job requests list, availability 
   toggle (prominent, easy one-tap switch), earnings summary, 
   active jobs

8. Provider Job Response screen: view job details, set price quote, 
   accept/decline

9. Rating & Review screen: star rating, comment, photo of completed 
   work (post-job)

10. Profile/Settings: user info, saved addresses, payment method 
    placeholder, help/support

INTERACTION NOTES
- Availability status should be the most visually prominent element 
  on any provider card — this is the app's core value prop
- Price ranges shown upfront on every provider card, never hidden
- Bottom tab navigation for Customer: Home, Search, My Requests, Profile
- Bottom tab navigation for Provider: Dashboard, Requests, 
  Availability, Profile
- Use empty states with friendly illustrations

Design in a mobile app frame (375x812), then adapt key screens 
(Home, Provider Profile) to a responsive web layout.
```

**Output of this step:** a Figma file with all 10 screens. Export each key screen as PNG (right-click frame → Export) into a folder called `design-reference/`.

---

## STEP 2 — Scaffold the project

Open Google Antigravity, start a new project, and give it this prompt:

```
Create a full-stack web app called "Tegagn" using:
- Frontend: React + Vite + Tailwind CSS + React Router
- Backend: Node.js + Express
- Database: MongoDB (using Mongoose)

Set up the project structure as:
/client — React frontend
/server — Express backend with /models, /routes, /controllers folders

Configure:
- CORS enabled on the backend
- Environment variables for MongoDB connection string (MONGO_URI) 
  and JWT secret (JWT_SECRET) in a .env file
- Basic Express server with a health-check route (GET /api/health)
- React app connected to the backend via a base API URL in a 
  config/constants file

Do not build any features yet — just the working skeleton with 
frontend and backend running and talking to each other.
```

**Verify:** run both frontend and backend locally, confirm `/api/health` responds and the React app loads a blank page without errors before moving on.

---

## STEP 3 — MongoDB schema

Prompt Antigravity:

```
In the /server/models folder, create Mongoose schemas for:

1. User
   - name, phone (unique), passwordHash, role (enum: "customer" 
     or "provider"), createdAt

2. ProviderProfile (references User)
   - userId (ref User), category (enum: plumbing, electrical, 
     construction, painting, cleaning, other), bio, priceRangeMin, 
     priceRangeMax, availabilityStatus (enum: available_now, busy, 
     scheduled), availableDate (optional), rating (default 0), 
     ratingCount (default 0), profilePhotoUrl, workPhotos (array of URLs)

3. Job
   - customerId (ref User), providerId (ref User, optional until 
     accepted), category, description, photoUrls (array), location, 
     urgency (enum: now, scheduled), scheduledDate (optional), 
     budgetMin, budgetMax, status (enum: pending, quoted, accepted, 
     in_progress, completed, cancelled), agreedPrice, createdAt, 
     updatedAt

4. Review
   - jobId (ref Job), customerId (ref User), providerId (ref User), 
     rating (1-5), comment, photoUrl (optional), createdAt

Add proper indexes on frequently queried fields (category, 
availabilityStatus, location). Export all models cleanly.
```

---

## STEP 4 — Auth & roles

```
Build authentication for Tegagn:

Backend:
- POST /api/auth/signup — accepts name, phone, password, role. 
  Hash password with bcrypt. Return a JWT.
- POST /api/auth/login — accepts phone, password. Verify and 
  return a JWT.
- Middleware to protect routes using the JWT (auth.middleware.js)
- Middleware to restrict routes by role (customer-only / 
  provider-only)

Frontend:
- Signup page matching this design: [attach your Figma export of 
  the Auth screen]
- Login page matching the same design
- Role selection (Customer / Provider) during signup
- Store JWT in localStorage, attach to all API requests via axios 
  interceptor
- Redirect to Home (customer) or Dashboard (provider) after login 
  based on role
- Protected route wrapper component that redirects to /login if 
  not authenticated
```

---

## STEP 5 — Provider browse & availability

```
Build the core browse experience:

Backend:
- GET /api/providers — returns provider list, supports query 
  params: category, availabilityStatus, sort (rating/price)
- PATCH /api/providers/me/availability — provider updates their 
  own availabilityStatus (auth required, provider-only)
- GET /api/providers/:id — full provider profile detail

Frontend (match this design): [attach your Figma export of the 
Home/Browse screen]
- Home page: search bar, category filter chips, provider card grid
- Provider card component: photo, name, category, rating stars, 
  price range, availability badge (green/gray/orange based on status)
- Provider profile detail page (match this design): [attach Figma 
  export of Provider Profile screen]
- Provider dashboard availability toggle: a prominent switch/button 
  the provider taps to go Available Now / Busy (match this design): 
  [attach Figma export of Provider Dashboard screen]
```

---

## STEP 6 — Job request flow

```
Build the job request and status flow:

Backend:
- POST /api/jobs — customer creates a job request (with optional 
  target providerId, or leave null for open request)
- GET /api/jobs/mine — customer sees their own job requests
- GET /api/jobs/incoming — provider sees job requests sent to them 
  or open requests in their category
- PATCH /api/jobs/:id/quote — provider sets agreedPrice and moves 
  status to "quoted"
- PATCH /api/jobs/:id/accept — customer accepts the quote, status 
  → "accepted"
- PATCH /api/jobs/:id/status — update status (in_progress, 
  completed, cancelled)

Frontend:
- Post a Job page (match this design): [attach Figma export]
- Job status tracking screen with a visual step indicator (Pending 
  → Quoted → Accepted → In Progress → Completed) (match this 
  design): [attach Figma export]
- Provider's incoming requests list with Accept/Decline/Quote 
  actions (match this design): [attach Figma export]
```

---

## STEP 7 — Reviews & ratings

```
Build the review system:

Backend:
- POST /api/reviews — customer submits rating (1-5) + comment 
  for a completed job. Update the provider's rating and 
  ratingCount (running average).
- GET /api/providers/:id/reviews — list reviews for a provider

Frontend:
- Review submission screen shown after a job status becomes 
  "completed" (match this design): [attach Figma export]
- Display reviews on the Provider Profile page (star rating list 
  with comments)
```

---

## STEP 8 — Seed realistic demo data

```
Write a seed script (/server/seed.js) that populates MongoDB with:
- 5 customer users with Ethiopian names
- 10 provider users covering all categories (plumbing, electrical, 
  construction, painting, cleaning), with Ethiopian names, price 
  ranges in ETB, mixed availability statuses
- 8 sample jobs in various statuses (pending, accepted, completed)
- 5 sample reviews with realistic comments

Locations should reference real Addis Ababa areas (Bole, Piassa, 
Kazanchis, Sarbet, CMC, etc.)

Add an npm script "seed" that runs this file.
```

Run it locally, then click through the entire app once end-to-end (post a job as customer → respond as provider → accept → complete → review) before touching deployment.

---

## STEP 9 — Deploy the database (MongoDB Atlas)

1. Go to mongodb.com/cloud/atlas → create a free account → create a free (M0) cluster.
2. Create a database user (username + password) under Database Access.
3. Under Network Access, add IP `0.0.0.0/0` (allow from anywhere — fine for a camp demo).
4. Click "Connect" → "Drivers" → copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tegagn`
5. Save this — you'll use it as `MONGO_URI` in the next step.

---

## STEP 10 — Deploy the backend (Render)

1. Push your `/server` folder to a GitHub repo.
2. Go to render.com → New → Web Service → connect your GitHub repo.
3. Set Root Directory to `server` (if backend is in a subfolder).
4. Build command: `npm install`
5. Start command: `node index.js` (or whatever your entry file is)
6. Add environment variables in Render's dashboard:
   - `MONGO_URI` = your Atlas connection string from Step 9
   - `JWT_SECRET` = any long random string
   - `PORT` = 10000 (Render's default; make sure your Express app uses `process.env.PORT`)
7. Deploy. Copy the live backend URL (e.g. `https://tegagn-api.onrender.com`).

---

## STEP 11 — Deploy the frontend (Vercel)

1. Push your `/client` folder to GitHub (same repo or separate — either works).
2. Go to vercel.com → New Project → import your repo.
3. Set Root Directory to `client`.
4. Framework preset: Vite.
5. Add environment variable:
   - `VITE_API_URL` = your Render backend URL from Step 10
6. Make sure your frontend's API config file reads from `import.meta.env.VITE_API_URL` instead of `localhost`.
7. Deploy. You now have a live URL for the whole app.

---

## STEP 12 — Final checks before demo day

```
Ask Antigravity: "Review the app for any hardcoded localhost URLs, 
missing error handling on API calls, and console errors. Fix any 
you find so the deployed version works cleanly."
```

Then manually click through the full flow one more time **on the live deployed URL**, not localhost — signup, browse, post a job, accept, complete, review — to catch anything that broke in deployment.

---

## Quick reference — order of operations

1. Figma design (Step 1)
2. Scaffold skeleton (Step 2)
3. MongoDB schema (Step 3)
4. Auth (Step 4)
5. Browse + availability (Step 5)
6. Job flow (Step 6)
7. Reviews (Step 7)
8. Seed data (Step 8)
9. Deploy DB → Atlas (Step 9)
10. Deploy backend → Render (Step 10)
11. Deploy frontend → Vercel (Step 11)
12. Final live testing (Step 12)
