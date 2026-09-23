# RITORA Backend API

> Node.js + Express REST API with Prisma ORM, Supabase PostgreSQL, and Google Gemini AI integration.

## Tech Stack

- **Framework**: Express.js + TypeScript (`tsx`)
- **Database**: Supabase PostgreSQL (via Prisma ORM)
- **AI Integration**: Google Generative AI (`@google/generative-ai` Gemini model)
- **Authentication**: JWT (`jsonwebtoken` + `bcryptjs`)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment variables:
   Copy `.env.example` to `.env` and fill in your Supabase connection strings and Gemini API Key:
   ```bash
   cp .env.example .env
   ```

3. Sync Prisma database schema:
   ```bash
   npx prisma db push
   ```

4. Seed the database with initial demo data:
   ```bash
   npm run prisma:seed
   ```

5. Run dev server:
   ```bash
   npm run dev
   ```

Server runs at `http://localhost:3001` (Health check: `http://localhost:3001/api/health`).
