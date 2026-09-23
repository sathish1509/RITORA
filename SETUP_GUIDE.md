# RITORA — Developer Setup & Installation Guide

This document provides step-by-step instructions for developers setting up, running, testing, and deploying the RITORA multi-platform application.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development Setup](#local-development-setup)
  - [1. Backend API (`/backend`)](#1-backend-api-backend)
  - [2. Web SaaS Application (`/web`)](#2-web-saas-application-web)
  - [3. Mobile Application (`/app`)](#3-mobile-application-app)
- [Running Database Migrations & Seeds](#running-database-migrations--seeds)
- [Docker & Container Deployment](#docker--container-deployment)
  - [Using Docker Compose (Recommended)](#using-docker-compose-recommended)
  - [Using Manual Docker Commands](#using-manual-docker-commands)
- [Running Test Suites](#running-test-suites)
- [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

## 🛠️ Prerequisites

Ensure your development workstation has the following tools installed:

- **Node.js**: Version `18.x` or `20.x` LTS ([Download Node.js](https://nodejs.org/))
- **npm**: Version `9.x` or higher (packaged with Node.js)
- **Git**: For version control
- **Docker & Docker Compose**: (Optional, required for containerization)
- **Expo Go App**: (Optional, for running mobile app on physical iOS/Android devices)

---

## 🔑 Environment Configuration

RITORA uses a single unified `.env` file located in the **project root directory** (`/RITORA/.env`).

Create a `.env` file at the root of the repository:

```env
# ==========================================
# RITORA Unified Environment Configuration
# ==========================================

# --- Backend API Configuration ---
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_custom_secure_jwt_secret_key_2026"
CORS_ORIGIN="http://localhost:5173,http://localhost:8081,http://localhost:3000,*"
GEMINI_API_KEY="your_google_gemini_api_key_here"

# --- Frontend / Web Configuration ---
VITE_API_BASE_URL="http://localhost:3001/api"
```

> **Note**: Both the Express backend and the Vite web server dynamically read from this single root `.env` file.

---

## 💻 Local Development Setup

Clone the repository and open a terminal in the project root:

```bash
git clone https://github.com/sathish1509/RITORA.git
cd RITORA
```

### 1. Backend API (`/backend`)

The backend is an Express Node.js application written in TypeScript with Prisma ORM.

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Generate Prisma Client & Push Database Schema
npx prisma generate
npx prisma db push

# (Optional) Seed initial demo data
npx prisma db seed

# Start development server with hot-reload
npm run dev
```

- **API Endpoint Base**: `http://localhost:3001/api`
- **Health Check Endpoint**: `http://localhost:3001/api/health`

---

### 2. Web SaaS Application (`/web`)

The web frontend is built with React 18, Vite, Tailwind CSS, and Lucide icons.

```bash
# Navigate to web folder
cd web

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

- **Local Web URL**: `http://localhost:5173`
- **Build Production Bundle**: `npm run build`

---

### 3. Mobile Application (`/app`)

The mobile application is built with React Native and Expo SDK 51.

```bash
# Navigate to app folder
cd app

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

- Press `w` to open in web browser mode.
- Scan the printed QR code with the **Expo Go** app on iOS or Android to run on a physical mobile device.

---

## 🗄️ Running Database Migrations & Seeds

The SQLite database schema is managed via Prisma in `backend/prisma/schema.prisma`.

```bash
cd backend

# Create a new Prisma migration after modifying schema.prisma
npx prisma migrate dev --name describe_your_change

# Reset database & re-run seeds
npx prisma migrate reset

# Inspect database visually with Prisma Studio
npx prisma studio
```

Prisma Studio will open an interactive database management UI at `http://localhost:5555`.

---

## 🐳 Docker & Container Deployment

You can build and deploy the complete RITORA platform (backend server + compiled static web application) inside a single containerized environment.

### Using Docker Compose (Recommended)

```bash
# Build and start services in background
docker-compose up -d --build

# View container logs
docker-compose logs -f

# Stop running services
docker-compose down
```

The app will be accessible at `http://localhost:3001`.

---

### Using Manual Docker Commands

```bash
# Build production Docker image
docker build -t ritora-platform .

# Run Docker container using root .env file
docker run -d -p 3001:3001 --env-file .env --name ritora-container ritora-platform

# Stop container
docker stop ritora-container
```

---

## 🧪 Running Test Suites

The backend includes test suites for phase verification, analytical algorithms, and risk screening engines:

```bash
cd backend

# Run all test suites
npm test

# Run tests in watch mode
npm run test:watch
```

---

## ❓ Troubleshooting & Common Issues

### Issue 1: `tsx: command not found` when starting backend
**Solution**: Ensure you ran `npm install` inside the `backend/` directory so devDependencies (including `tsx`) are installed locally.

### Issue 2: Prisma Client errors or missing database tables
**Solution**: Run `npx prisma generate` followed by `npx prisma db push` inside `backend/`.

### Issue 3: CORS error when connecting Web to Backend
**Solution**: Check `CORS_ORIGIN` in root `.env`. Ensure `http://localhost:5173` is listed and that the backend server is running on port `3001`.
