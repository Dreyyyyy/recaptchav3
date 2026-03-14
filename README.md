# Recaptcha V3

A minimal playground for **reCAPTCHA v3**: React (Vite) frontend and Node (Express) backend, with automatic verification on page load and server-side token verification.

## What's implemented

- **Frontend (React + Vite + TypeScript)**
  - reCAPTCHA v3 script is loaded dynamically with the site key from env.
  - On page load, once the script is ready, `grecaptcha.execute(siteKey, { action: 'page_view' })` runs automatically (no user click).
  - The token is sent to the backend; the UI shows "Checking…" then the result (success with score/action, or failure/error).

- **Backend (Node + Express)**
  - `POST /api/verify-recaptcha`: accepts `{ token }`, calls Google's siteverify API with the secret key, and returns the result (e.g. `success`, `score`, `action`, `error-codes`).
  - CORS enabled for the frontend dev server.
  - Health check: `GET /` returns `OK`.

- **Flow**
  1. User opens the app → reCAPTCHA script loads → when ready, execute runs in the background.
  2. Frontend receives the token and POSTs it to `/api/verify-recaptcha`.
  3. Backend verifies the token with Google and responds; frontend displays the score and outcome.

## Prerequisites

- Node.js (backend uses built-in `fetch`; Node 18+ recommended).
- A reCAPTCHA **v3** site in the [reCAPTCHA Admin](https://admin.google.com/recaptcha). Add `localhost` (and any other domains) to the site's domains.

## Environment variables

- **Frontend** (`frontend/.env`):
  - `VITE_RECAPTCHA_SITE_KEY` — reCAPTCHA v3 site key (public).

- **Backend** (`backend/.env`):
  - `SECRET_KEY` — reCAPTCHA v3 secret key (never commit).
  - Optional: `PORT` (default `3000`).

## Project structure

```
recaptchav3/
├── frontend/          # React + Vite app
│   ├── .env
│   └── src/
│       └── App.tsx    # script load, grecaptcha.ready(), execute on load, fetch to backend
├── backend/
│   ├── .env
│   ├── server.ts      # Express app, /api/verify-recaptcha, siteverify (POST body)
│   └── package.json
└── README.md
```

## How to run

1. **Backend** (keep this terminal open):

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   Visit `http://localhost:3000/` to confirm "OK".

2. **Frontend** (separate terminal):

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open the URL Vite prints (e.g. `http://localhost:5173/`). Verification runs automatically on load; the result (score and action) appears on the page.

## References

- [reCAPTCHA v3 (Google)](https://developers.google.com/recaptcha/docs/v3)
- [Verify the user's response](https://developers.google.com/recaptcha/docs/verify) (server-side)
