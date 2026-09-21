# RITORA — AI-Powered Menstrual Health Intelligence

> **Understand Your Rhythm. Understand Your Health.**

RITORA is a dual-platform health intelligence application that uses AI to provide personalized menstrual health insights, pattern detection, and lifestyle-health correlation analysis.

---

## Project Structure

```
RITORA/
├── web/          → React SaaS Web Application
├── app/          → React Native Expo Mobile Application
├── backend/      → Reserved for Backend Teammate
└── README.md     → This file
```

---

## Web Application (`/web`)

### Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Lucide React (icons)
- Recharts (charts)

### Setup

```bash
cd web
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`

### Environment Variables

Create `web/.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

> While the backend is not connected, the app uses built-in mock data automatically.

### Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Registration |
| `/onboarding` | New user onboarding |
| `/dashboard` | Main dashboard |
| `/cycle` | Cycle tracking |
| `/symptoms` | Symptom logging |
| `/lifestyle` | Lifestyle tracking |
| `/insights` | AI health insights |
| `/assistant` | AI assistant |
| `/reports` | Health reports |
| `/settings` | User settings |

---

## Mobile Application (`/app`)

### Tech Stack
- React Native + TypeScript
- Expo (SDK 51+)
- Expo Router (file-based routing)

### Setup

```bash
cd app
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone, or press `w` to open in web mode.

### Environment Variables

Create `app/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### Navigation

Bottom tab navigation with 5 tabs:

| Tab | Description |
|-----|-------------|
| Home | Dashboard summary & quick actions |
| Cycle | Cycle calendar & history |
| Track | Quick symptom & lifestyle logging |
| Insights | AI insights & risk indicators |
| Profile | User profile & settings |

---

## Mock Data & Demo

Both applications come pre-loaded with demo data for a presentation-ready experience.

### Demo User

| Field | Value |
|-------|-------|
| Name | Sarah |
| Age | 24 |
| Average Cycle | 29 days |
| Current Cycle | 35 days (Day 35) |
| Deviation | +6 days |

### Demo Credentials

```
Email: sarah@ritora.app
Password: demo1234
```

### Demo Story

RITORA detects that Sarah's current cycle (35 days) deviates +6 days from her personal average (29 days). Combined with her symptoms (heavy flow, fatigue, cramps) and lifestyle factors (5h sleep, high stress), RITORA shows:

1. **"Pattern Change Detected"** — Current cycle differs significantly from personal average
2. **Lifestyle correlation** — Sleep deficit and high stress noted in recent records
3. **Moderate anemia-risk indicator** — Awareness indicator (not a medical diagnosis)

---

## API Integration Points

### Service Architecture

Both web and mobile use an identical service layer pattern:

```
services/
├── api.ts              → Base API client
├── authService.ts      → Authentication
├── cycleService.ts     → Cycle data
├── symptomService.ts   → Symptom data
├── lifestyleService.ts → Lifestyle data
├── insightService.ts   → AI insights
└── reportService.ts    → Reports
```

### Backend Integration Instructions

When the backend is ready:

1. Set the environment variable to your API URL:
   - Web: `VITE_API_BASE_URL=https://api.ritora.app`
   - Mobile: `EXPO_PUBLIC_API_BASE_URL=https://api.ritora.app`

2. Replace the mock implementations in each service file with actual `fetch`/`axios` calls. The function signatures and return types are already defined — just swap the data source.

3. The expected API response format matches the TypeScript interfaces in `src/types/index.ts`. Design your backend API responses to match these types.

### Expected API Endpoints

| Method | Endpoint | Service Function |
|--------|----------|-----------------|
| POST | `/auth/login` | `authService.login()` |
| POST | `/auth/register` | `authService.register()` |
| GET | `/auth/me` | `authService.getCurrentUser()` |
| GET | `/cycles` | `cycleService.getCycles()` |
| POST | `/cycles` | `cycleService.createCycle()` |
| GET | `/cycles/current` | `cycleService.getCurrentCycle()` |
| GET | `/symptoms` | `symptomService.getSymptoms()` |
| POST | `/symptoms` | `symptomService.createSymptom()` |
| GET | `/lifestyle` | `lifestyleService.getLifestyle()` |
| POST | `/lifestyle` | `lifestyleService.createLifestyleEntry()` |
| GET | `/insights` | `insightService.getInsights()` |
| GET | `/insights/risks` | `insightService.getRiskIndicators()` |
| GET | `/insights/predictions` | `insightService.getPredictions()` |
| GET | `/reports` | `reportService.getReports()` |
| POST | `/reports/generate` | `reportService.generateReport()` |

---

## Brand Identity

| Token | Color |
|-------|-------|
| Deep Plum | `#4A245E` |
| Soft Lavender | `#B89AD9` |
| Warm Ivory | `#FAF8F4` |
| Soft Lilac | `#EDE4F5` |
| Deep Charcoal | `#24212A` |
| Muted Sage | `#A8C3B0` |
| Soft Amber | `#E5B96B` |

---

## License

Proprietary — Hackathon Project
