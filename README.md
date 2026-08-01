# 🏠 Tegagn (ተጋኝ) — On-Demand Local Home Services Platform

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React_18_%7C_Tailwind_CSS-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Backend-Node.js_%7C_Express-339933.svg)
![Database](https://img.shields.io/badge/Database-MongoDB_%7C_Mongoose-47A248.svg)

**Tegagn** is a full-stack, production-ready on-demand home services platform designed for connecting customers with verified local service providers (Plumbers, Electricians, Carpenters, Painters, Cleaners, and More) across Ethiopia.

---

## ✨ Key Features

### 🌐 Landing Page

- **Figma-Matched Design**: Dark royal navy hero section, interactive category explorer, and live platform metrics.
- **Dynamic Stats API**: Fetches real-time counts for verified providers, completed jobs, and registered customers directly from MongoDB (`GET /api/public/stats`).
- **Smart Authentication Routing**: Guests view the landing page; logged-in users are automatically routed to their role dashboard (`/home`, `/dashboard`, or `/admin`).

### 👤 Customer Experience

- **Provider Discovery**: Explore verified providers with real-time availability badges, ratings, price ranges, and category filters.
- **Job Requests**: Create job requests with custom budgets, locations, and descriptions.
- **Request Tracking**: Monitor status (`pending`, `quoted`, `in_progress`, `completed`).
- **User Profile Management**: Canvas-cropped photo avatar uploads, saved addresses (Home, Office), payment method preferences (Telebirr, CBE Birr, Cash), and notification settings.

### ⚡ Service Provider Console

- **Dashboard & Stats**: Live earnings metrics, completed job counts, and rating breakdown.
- **Availability Toggle**: Instant status switching (`Available Now`, `Busy`, `Offline`).
- **Job Management**: Accept incoming requests, submit quotes, and manage ongoing services.
- **Profile Customization**: Update bio, price range, service categories, and work sample photo galleries.

### 🛡️ Production Admin Console (`/admin`)

- **Real-Time Platform Overview**: Total revenue MTD, active jobs, provider breakdown, and customer totals via MongoDB aggregation pipelines.
- **Administrative Governance**:
  - **Job Management**: Force complete or cancel stuck/disputed jobs with database state sync.
  - **Provider Verification**: Inspect documentation, verify accounts, or suspend providers.
  - **Security Audit Trail**: Persistent logging of all admin actions (`AuditLog` collection).
  - **Emergency Safety Switch**: Toggle global platform locks during system maintenance or security alerts.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Axios, React Portals.
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose ODM, JWT, Bcryptjs.
- **Architecture**: REST API with role-based access control (RBAC) middleware.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/amayukf/Tegang.git
   cd Tegang
   ```

2. **Backend Setup**:

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file inside `server/`:

   ```env
   PORT=10000
   MONGODB_URI=mongodb://127.0.0.1:27017/tegang
   JWT_SECRET=your_super_secret_jwt_key
   ```

   Run the backend dev server:

   ```bash
   npm run dev
   ```

3. **Frontend Setup**:

   ```bash
   cd ../client
   npm install
   ```

   Create a `.env` file inside `client/`:

   ```env
   VITE_API_URL=http://localhost:10000/api
   ```

   Run the frontend dev server:

   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Administrative Account

The platform automatically seeds a default admin account upon starting the server:

- **Phone**: `0929330533`
- **Password**: `ame123`
- **Admin Dashboard**: Accessible at `/admin` after logging in.

---

## 📄 License

This project is licensed under the MIT License.
