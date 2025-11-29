## RFID Integration Instructions

### Overview
- The RFID scanner app lives in `../Flask/LENS---Reader/` and posts scans to the Express backend at `../Express/LENS---Backend/rfid-entry-backend/`. Your React frontend should make the same calls as soon as a scan is received so operators can see the status of the barcode, register new visitors, or mark attendance.
- Use TanStack Query (`@tanstack/react-query`) for any frontend requests to keep cache/state in sync and for invalidating data whenever the backend emits changes such as QR creation or attendance records.

### API Layer
1. Use the existing Axios client (`src/api/client.ts`) and point `VITE_API_BASE` at the Express backend. This ensures every Retrofit-friendly request shares the same interceptors and headers.
2. Add a new endpoints file, e.g., `src/api/endpoints/rfid.ts`, with pure functions for every backend interaction:
   - `fetchUserByRfid(rfid: string)` — GET/POST depending on the backend, returning the user record or “not found”.
   - `createQrForUser(payload)` — handles new user creation and returns the QR payload plus an expiry timestamp.
   - `recordAttendance(userId: string)` — adds an entry tied to the current timestamp.
   - `refreshUserQr(userId: string)` — reissues a temporary QR for edits.
3. Keep the functions free of React logic so they stay reusable across queries and mutations.

### TanStack Query Hooks
1. Ensure the app registers a `QueryClient` in `src/main.tsx` and wraps `<App />` with `<QueryClientProvider>`.
2. Add query hooks:
   - `useRfidUser(rfid)` that loads the user tied to a badge, keyed on `["rfid", rfid]`.
   - `useLatestScan()` (or similar) to poll the backend for the most recent scan timestamp if no socket interface exists.
3. Add mutation hooks:
   - `useGenerateQr()` — uses `createQrForUser`, and on success invalidates `["rfid", payload.rfid]` plus any attendance summaries.
   - `useRecordAttendance()` — invalidates `["attendance", "recent"]` and refreshes the RFID user cache.
   - `useRefreshUser()` — reissues the QR, invalidates user and QR queries, and optionally triggers `["qr", userId]` refetches.

### UI Flow
1. Create an RFID dashboard page (e.g., in `src/pages/rfid-dashboard`) that:
   - Displays the last scanned RFID and its profile if found; show a “New user” card otherwise.
   - Offers a form to collect registration information, then calls `useGenerateQr()` to create and present the expiring QR code (use any QR component and show the expiry countdown from the backend response).
   - Shows existing-user actions: “Record attendance” and “Reissue QR”. Hook those buttons to the mutation hooks.
2. When a QR expires, relay that status from the backend and allow the operator to tap “Reissue” to call `useRefreshUser()`.
3. Use mutation loading states to disable buttons until the backend responds and display success/error toasts or alerts.

### Routing & Sync
- Register the new dashboard inside `src/router` or `layout.tsx` so it’s reachable from the navigation menu.
- If the Express backend can emit the latest scan (via SSE/websocket), connect it. Otherwise, poll a lightweight endpoint every few seconds using a query with `refetchInterval`.

### Validation & Docs
1. After wiring the UI, manually test each branch: new user → QR generation, existing user → attendance, and edit flow → QR refresh.
2. Use TanStack invalidation judiciously to ensure the dashboard always reflects the latest user/QR data after every mutation.
3. Document the flow (endpoint contracts, TanStack keys, expiration handling) for teammates in this or another internal doc so future devs can extend it.
