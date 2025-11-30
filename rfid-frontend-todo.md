## RFID Frontend Integration – Remaining Tasks

### 1. Environment & Base Client
- [ ] **Confirm API base URL**: Set `VITE_API_BASE` in your Vite `.env` so that `src/api/client.ts` points to the Express backend (e.g. `http://localhost:5000/api`).
- [ ] **Verify CORS + FRONTEND_FORM_URL**: Ensure Express has `FRONTEND_FORM_URL` (and `CORS_ORIGIN` if needed) pointing at this frontend URL (e.g. `http://localhost:5173`) so the `formUrl` sent to the Flask reader matches the actual app.

### 2. Routing & Page Wiring
- [ ] **Expose `EntryForm` route**: Confirm that `src/pages/entryForm.tsx` is registered in your router (e.g. `router/index.tsx`) at path `/entry-form`.
- [ ] **Test QR → browser navigation**: Scan an RFID that returns a `formUrl` and verify that scanning the QR on a phone opens the `EntryForm` page with a `token` query param (e.g. `/entry-form?token=...`).

### 3. Token-Based Form Flow (TanStack Query)
- [ ] **Verify `getUserByToken` hook usage**: In `entryForm.tsx`, confirm `useQuery` correctly calls the `getUserByToken` API, handles loading/error states, and pre-fills the form when `data.data` contains user information.
- [ ] **Handle “token expired” UX**: Improve the error state when `GET /entries/form?token` returns 404 (expired/invalid token) with a clearer message and instructions to re-scan.
- [ ] **Confirm signup vs edit behavior**: Manually test both cases:
  - Unknown RFID → form loads with mostly empty fields (signup).
  - Known RFID → form loads with prefilled values (edit).

### 4. Upsert Mutation & Cache Invalidation
- [ ] **Ensure `upsertUser` API is wired**: Confirm that `src/api/users.ts` has a `upsertUser` function calling `POST /users/upsert` and that it matches the backend payload contract (`token`, `idNumber`, names, college, department, yearLevel, userType, optional email).
- [ ] **Review `useUpsertUser` invalidation**: In `src/hooks/form/useUpsertUser.ts`, verify that on success it invalidates both `['entries']` and `['users']` so attendance tables and user lists refresh.
- [ ] **Improve success UX on `EntryForm`**: Replace `alert` with your standard toast/notification pattern and keep the “close tab or show close message” behavior for cases where `window.close()` is blocked.

### 5. Standalone Signup Page Cleanup
- [ ] **Remove dev RFID placeholder**: In `src/pages/signUp.tsx`, replace the `devRfid` generation with either:
  - A real RFID coming from the backend (preferred, once you have a flow), or
  - A clear “manual registration” mode that is not used in production RFID paths.
- [ ] **Align signup payload**: Ensure the payload shape sent by `SignUp` matches `createUser`/`upsertUser` expectations (same field names and types used by the backend).

### 6. Attendance Views & Live Data
- [ ] **Check entries query usage**: In the table/records feature, confirm that queries consuming `getEntries` use a query key like `['entries', filters...]` so the `['entries']` invalidation from `useUpsertUser` correctly triggers refetch.
- [ ] **Optional – live refresh**: If you want the records view to feel “live” when a scan happens:
  - Add `refetchInterval` to the entries query, or
  - Provide a “Refresh” button near the table that calls `queryClient.invalidateQueries({ queryKey: ['entries'] })`.

### 7. QA Checklist
- [ ] **Scenario A – New user**:
  - Scan unregistered RFID → backend returns `status: "signup"` and `formUrl`.
  - Reader shows QR → scanning opens `EntryForm` with empty-ish form.
  - Submit → user is created, token is consumed, entry is logged, and entries/users lists reflect the new user.
- [ ] **Scenario B – Existing user (normal tap)**:
  - Scan active RFID with no recent entry → success response, entry logged.
  - Optionally use the returned `formUrl` to open `EntryForm` and validate that data is prefilled.
- [ ] **Scenario C – Duplicate tap (edit)**:
  - Scan the same card again within 5 minutes → backend returns `status: "duplicate"` and `formUrl`.
  - Reader shows QR → scanning opens `EntryForm` with prefilled fields, allowing edits and resubmission.
- [ ] **Scenario D – Expired token**:
  - Wait >10 minutes and try opening an old `formUrl` → token should be invalid/expired, and the frontend should show a helpful message.


