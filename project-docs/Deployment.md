# Deployment Strategy

This project expects a decoupled setup: Frontend deployed on Serverless (Vercel) and Backend deployed to a PaaS Container/Node runtime (Render or Railway).

## Local Development
1. Clone the repository and run `npm install` from the root workspace.
2. In the `apps/backend`, copy `.env.example` to `.env` and fill in DB and GitHub credentials.
3. Boot external stores locally via docker compose:
   `docker-compose up -d` (Spins up Postgres & Redis).
4. Apply DB schema: `npx prisma db push`
5. Run the frontend and backend in parallel via: `npm run dev`.

## Environment Setup
Required secrets:
- `DATABASE_URL` (Supabase or Neon URI)
- `REDIS_URL` (Upstash or native)
- `JWT_SECRET`
- `GITHUB_API_KEY`

## Database Setup
Production PostgreSQL should be spun up natively via **Neon** or **Supabase**. Ensure the URI incorporates connection pooling if deploying to edge locations.

## Redis Setup
**Upstash Redis** is recommended for cheap and extremely fast un-persisted data caching. Fetch the endpoint and password, supplying them via `REDIS_URL` formatted `redis://default:password@endpoint:port`.

## Backend Deployment (Render / Railway)
- Use standard build commands: `npm run build` targeting `apps/backend`.
- Start commands: `npm run start`.
- Inject your `GITHUB_API_KEY` into Render's secret configuration pane.

## Vercel Deployment (Frontend)
- Target the Framework Preset for "Next.js".
- Select Root Directory as `apps/frontend`.
- Specify the `NEXT_PUBLIC_API_URL` to point heavily to the Render/Railway backend domain location.

## CI/CD Suggestions
- **GitHub Actions**: 
  - On PR Open: Run `npm run lint` and `npm run test`.
  - On Merge `main`: Vercel auto-deploys frontend; Render auto-syncs the latest commit to the backend instance.