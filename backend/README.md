# RITORA Backend

> This directory is reserved for the backend teammate.

## Integration

The web and mobile frontends are pre-configured with a service abstraction layer. When the backend is ready:

1. Set `VITE_API_BASE_URL` (web) and `EXPO_PUBLIC_API_BASE_URL` (mobile) to your API URL
2. Replace mock implementations in `services/` with real API calls
3. Match your API response format to the TypeScript interfaces in `src/types/index.ts`

See the root [README.md](../README.md) for the full list of expected API endpoints.
