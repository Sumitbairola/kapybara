# Kapybara Blog - Full-Stack Blogging Platform

A modern, full-stack blogging platform built with Next.js 15, tRPC, Prisma, and PostgreSQL. Features a complete CRUD system for blog posts and categories with a beautiful, responsive UI.

## 🚀 Live Demo

**Live Site:** [https://kapybara-blog.vercel.app/]

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [tRPC Router Structure](#trpc-router-structure)
- [Database Seeding](#database-seeding)
- [Trade-offs & Decisions](#trade-offs--decisions)
- [Time Spent](#time-spent)

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI** (Component Library)
- **Lucide React** (Icons)
- **Sonner** (Toast Notifications)
- **React Hook Form** (Form Management)

### Backend

- **tRPC** (End-to-end typesafe APIs)
- **Prisma** (ORM)
- **PostgreSQL** (Database)
- **Zod** (Schema Validation)

### Deployment

- **Vercel** (Frontend & Backend)
- **Neon/Supabase** (PostgreSQL Database)

## ✨ Features

### Priority 1 (Core Features) ✅

- [x] Create, Read, Update, Delete blog posts
- [x] Category system (assign one category per post)
- [x] Draft and Published status for posts
- [x] Markdown support for post content
- [x] Slug generation from titles
- [x] Responsive design (mobile, tablet, desktop)
- [x] tRPC for type-safe API calls

### Priority 2 (Enhanced Features) ✅

- [x] Category management (Create, Delete)
- [x] Filter posts by category
- [x] Post preview/truncation in list view
- [x] Created/Updated timestamps
- [x] Loading states and error handling
- [x] Toast notifications for user feedback
- [x] Empty states with helpful CTAs

### Priority 3 (Polish) ✅

- [x] Beautiful landing page
- [x] Dashboard with statistics
- [x] Search/filter functionality
- [x] Confirmation dialogs for destructive actions
- [x] Optimistic UI updates
- [x] Professional UI with Shadcn components
- [x] Consistent design system
- [x] Accessibility considerations

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm package manager

### Local Development Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Sumitbairola/kapybara.git
    cd kapybara-blog

    ```

2.  **Install dependencies**

    ```bash
    npm install

    ```

3.  **Set up environment variables**
    Create a .env file in the root directory:
    cp .env.example .env

4.  Set up the database

        # Generate Prisma Client

    npm prisma generate

# Run migrations

    npm prisma migrate dev

# (Optional) Seed the database

    npm prisma db seed

5. Run the development server

    npm run dev

6. Open your browser

    Navigate to http://localhost:3000




