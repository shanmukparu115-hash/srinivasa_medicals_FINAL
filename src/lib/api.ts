// ============================================================
// api.ts — Central API Base URL
// Dev:  VITE_API_URL=""  → /api/... handled by Vite proxy → localhost:5000
// Prod: VITE_API_URL="https://your-backend.railway.app" → direct calls
// ============================================================
export const API_BASE: string = (import.meta.env.VITE_API_URL as string) ?? '';
