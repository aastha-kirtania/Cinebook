<<<<<<< HEAD
# Cinebook

This project now has two moving parts:

- the frontend app served locally through the ICP local network
- a separate MySQL-backed API for movies, showtimes, bookings, and seat state

## Run locally

From PowerShell in the repo root:

```powershell
.\scripts\run-local.ps1
```

Open:

```text
http://txyno-ch777-77776-aaaaq-cai.localhost:8000
```

## Stop the local network

```powershell
.\scripts\stop-local.ps1
```

## MySQL mode

1. Start MySQL:

```powershell
.\scripts\start-mysql.ps1
```

2. Start the API:

```powershell
.\scripts\start-api.ps1
```

3. Start the frontend:

```powershell
.\scripts\run-local.ps1
```

The frontend expects the API at:

```text
http://localhost:3001/api
```

## Notes

- Docker Desktop must be running.
- WSL Ubuntu is used for the local build and deploy.
- The WSL deploy helper lives at [scripts/run-wsl-deploy.sh](/c:/Users/KIIT0001/cinebook/scripts/run-wsl-deploy.sh).
- The MySQL API package lives in [src/server](/c:/Users/KIIT0001/cinebook/src/server).

## Deploy Frontend To Vercel

This repo is split into:

- a Vite frontend in [src/frontend](/c:/Users/KIIT0001/cinebook/src/frontend)
- a separate Node/MySQL API in [src/server](/c:/Users/KIIT0001/cinebook/src/server)

For production deployment:

1. Deploy the backend API and MySQL somewhere other than Vercel.
2. Deploy only [src/frontend](/c:/Users/KIIT0001/cinebook/src/frontend) to Vercel.
3. Set `VITE_API_BASE_URL` in Vercel to your deployed backend URL, for example:

```text
https://your-backend-domain.example.com/api
```

Recommended Vercel settings:

- Framework Preset: `Vite`
- Root Directory: `src/frontend`
- Build Command: `pnpm build:skip-bindings`
- Output Directory: `dist`

The frontend includes [src/frontend/vercel.json](/c:/Users/KIIT0001/cinebook/src/frontend/vercel.json) so client-side routes work correctly on Vercel.

## Deploy Backend To Railway

The backend in [src/server](/c:/Users/KIIT0001/cinebook/src/server) is ready to deploy from GitHub to Railway.

Files added for this:

- [railway.json](/c:/Users/KIIT0001/cinebook/railway.json)
- [src/server/.env.production.example](/c:/Users/KIIT0001/cinebook/src/server/.env.production.example)

Recommended Railway flow:

1. Push this repo to GitHub.
2. In Railway, create a new project from the GitHub repo.
3. Add a MySQL service in Railway.
4. Add these backend environment variables to the app service:

```text
PORT=3001
MYSQL_HOST=<your-railway-mysql-host>
MYSQL_PORT=<your-railway-mysql-port>
MYSQL_USER=<your-railway-mysql-user>
MYSQL_PASSWORD=<your-railway-mysql-password>
MYSQL_DATABASE=<your-railway-mysql-database>
```

5. Railway will use this start command automatically:

```text
pnpm --filter @cinebook/server start
```

6. After Railway gives you a public backend URL, set this in Vercel for the frontend:

```text
VITE_API_BASE_URL=https://your-railway-backend-domain/api
```

Notes:

- The server auto-creates the database tables on startup.
- CORS is already enabled in the backend.
- The current backend is suitable for Railway-style Node hosting, not Vercel serverless hosting.
=======
# Cinebook
>>>>>>> b13e8567bd64a5df0f382ef41ec2c2b9a08e3380
