# Multi-stage Dockerfile for RITORA Platform (Backend API + Web Frontend)

# -----------------------------------------------------------------------------
# Stage 1: Build Backend & Web Frontend
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package*.json ./
COPY .env ./

# --- Build Backend ---
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# --- Build Web Frontend ---
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
COPY .env /app/.env
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Runtime Environment
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy Backend output & production node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/prisma ./backend/prisma

# Copy Web Frontend static build output
COPY --from=builder /app/web/dist ./web/dist

# Copy Root .env configuration
COPY --from=builder /app/.env ./.env

EXPOSE 3001

WORKDIR /app/backend

CMD ["node", "dist/server.js"]
