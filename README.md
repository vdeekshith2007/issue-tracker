# Issue Tracker Pro 🚀

A production-grade, collaborative issue and project tracking platform built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

Inspired by modern developer productivity platforms like **Linear** and **Jira**, Issue Tracker Pro offers an intuitive interface, real-time analytics, status-driven workflows, and robust authentication.

---

## ✨ Features

- **📊 Interactive Dashboard**: Real-time project overview with status breakdown (`Open`, `In Progress`, `Closed`), dynamic workload charts powered by Recharts, and latest issues feed.
- **🎯 Issue Management**: Complete CRUD operations for project issues with human-readable keys, title, description (Markdown-supported), status, and priority.
- **🔍 Search & Filtering**: Instant server-side status filtering and sortable columns (by title, status, date created) with pagination.
- **👤 Assignee Workflow**: Easily assign issues to team members with live optimistic updates and notifications.
- **🔐 Authentication & RBAC**: NextAuth integration supporting both **Email & Password credentials** (with secure bcrypt hashing) and **Google OAuth SSO**.
- **🎨 Modern Design System**: Built with `@radix-ui/themes` and Tailwind CSS, featuring dark mode, accessible dialogs, badges, and responsive layouts.
- **⚡ Performance & Stability**: Fast Turbopack builds with Prisma 7 MariaDB/MySQL driver adapter for connection pooling and sub-millisecond query performance.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Frontend**: [React 19](https://react.dev/), [Radix Themes](https://www.radix-ui.com/themes), [Tailwind CSS 4](https://tailwindcss.com/)
- **Data Layer**: [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-mariadb`
- **Database**: MySQL / MariaDB / PlanetScale / Aiven
- **Auth**: [NextAuth.js](https://next-auth.js.org/) with Prisma Adapter & bcryptjs
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Data Fetching**: [TanStack Query v5](https://tanstack.com/query) & [Axios](https://axios-http.com/)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or `v24.x`
- **MySQL / MariaDB**: Running locally or on a cloud provider (e.g. PlanetScale, Railway, Supabase, Aiven)

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd issue-tracker

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Update your `.env` with your database credentials:
```env
DATABASE_URL="mysql://root:password@localhost:3306/issue_tracker"
NEXTAUTH_SECRET="your-32-character-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup & Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate deploy
```

### 5. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Building for Production

To test the optimized production build locally:
```bash
# Compile and build Next.js production bundle
npm run build

# Start production server
npm start
```

---

## 🌐 Deployment Guide

### Option 1: Vercel (Recommended)
1. Push your code to a GitHub repository:
   ```bash
   git add .
   git commit -m "feat: upgrade to Issue Tracker Pro production build"
   git push origin main
   ```
2. Import the repository into [Vercel](https://vercel.com/new).
3. Set the **Root Directory** to `issue-tracker` (if using nested folder) or root.
4. Add the following **Environment Variables** in Vercel Project Settings:
   - `DATABASE_URL`: Cloud MySQL connection string (from PlanetScale, Railway, or Aiven)
   - `NEXTAUTH_SECRET`: Random 32+ character string
   - `NEXTAUTH_URL`: Your Vercel production domain (e.g. `https://your-app.vercel.app`)
5. Click **Deploy**.

### Option 2: Docker / Container Deployment
```dockerfile
FROM node:24-alpine AS runner
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🔒 Security & Best Practices

- **Zero Client Secret Leakage**: Database URLs and authentication secrets remain strictly server-side.
- **SQL Injection Immune**: Handled through Prisma parameterized queries and Zod schema validation.
- **Safe Dynamic Imports**: Heavy editor components (SimpleMDE) load client-side with SSR safety checks.
