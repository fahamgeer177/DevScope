# Security Measures

Security is critical to the DevScope platform, protecting both downstream API limits (Github) and upstream user resources constraint. 

## JWT Authentication
- Utilizes cryptographically strong ECDSA (ES256) signature algorithms.
- Payload is minimal, holding only `userId` and `exp`.
- Tokens expire in 1-hour windows to reduce compromise surface.

## Password Hashing
- `bcrypt` with a work-factor (salt rounds) of `12`. Passwords are never stored in plain-text, nor are they logged in application debug trails.

## Environment Variables
- Handled strictly by `.env` mechanisms. Secrets (e.g., `GITHUB_PAT`, `DATABASE_URL`) are loaded server-side only. 
- Using `zod-env` to parse and crash the instance on startup if any critical environment variables are absent.

## SQL Injection Prevention
- Ensured organically by using Prisma ORM. Prisma maps all arbitrary user-input to parameterized queries underneath, rendering standard injection tactics obsolete.

## Rate Limiting
- Built-in Redis-backed Sliding Window algorithms limit DDOS attempts. 
- 60 requests per 15 minutes for public, 300 for authenticated. 

## XSS Protection & Sanitization
- Input received on the backend is stripped of HTML via DOMPurify before any analytics mapping.
- React/Next.js inherently escapes rendered JSX variables.

## CORS & Secure Headers
- Using the `cors` package tuned strictly to DevScope deployment domains (e.g. `https://devscope.com`). Preflights are validated.
- **Helmet.js** is deployed configuring deep HTTP response restrictions:
  - `Content-Security-Policy` (CSP)
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options: DENY` (Prevent clickjacking)

## Validation Strategy
- `zod` schema files on both Frontend and Backend share validation rules.
- Fast-fail validations bounce malformed requests prior to engaging Database/Business tiers.