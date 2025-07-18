# Cloud Run Deployment Fix

## Issue Identified

The "Load failed" error was caused by the Cloud Run container failing to start and listen on port 8080. The specific error was:

```
generic::failed_precondition: Revision 'leirisonda-build-2025-07-18-001' is not ready and cannot serve traffic. The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable
```

## Root Causes Fixed

### 1. Incorrect Default Port

- **Problem**: Server was defaulting to port 3000 instead of 8080
- **Fix**: Changed `server/node-build.ts` to use `process.env.PORT || 8080`

### 2. Missing Server Build Process

- **Problem**: Only client was being built, server TypeScript files weren't compiled
- **Fix**: Added proper server build pipeline with esbuild

### 3. Incorrect Static File Path

- **Problem**: Server was looking for files in `../spa` but they were in `../`
- **Fix**: Updated path in `server/node-build.ts` to `path.join(__dirname, "..")`

### 4. Missing Runtime Dependencies

- **Problem**: `cors` was in devDependencies but needed at runtime
- **Fix**: Moved `cors` to dependencies in package.json

### 5. Server Not Binding to All Interfaces

- **Problem**: Server binding to localhost only
- **Fix**: Changed listen call to bind to `"0.0.0.0"`

### 6. Missing Health Check Endpoint

- **Problem**: Cloud Run expects health check endpoint
- **Fix**: Added `/health` endpoint that returns 200 status

## Files Modified

1. `server/node-build.ts` - Fixed port, binding, and static path
2. `server/index.ts` - Added health check endpoint, fixed import paths
3. `server/routes/demo.ts` - Fixed import paths for ES modules
4. `package.json` - Added server build script, moved cors to dependencies
5. `build-server.js` - Created server build script using esbuild
6. `Dockerfile` - Created optimized container for Cloud Run
7. `.dockerignore` - Optimized container build

## Build Process

### Local Development

```bash
npm run dev  # Starts Vite dev server on port 5173
```

### Production Build

```bash
npm run build  # Builds both client and server
npm start      # Starts production server on port 8080
```

### Manual Server Build

```bash
npm run build:client  # Build React app
npm run build:server  # Build Express server
```

## Deployment

### Using Cloud Run

1. Build the app: `npm run build`
2. Build container: `docker build -t leirisonda .`
3. Deploy to Cloud Run with PORT=8080

### Container Structure

```
dist/
├── index.html              # React app entry point
├── assets/                 # Client JS/CSS bundles
├── server/
│   ├── node-build.js      # Server entry point
│   ├── index.js           # Express app
│   └── routes/
│       └── demo.js        # API routes
└── shared/                # Shared types
```

## Key Endpoints

- `/` - React application
- `/health` - Health check (returns 200)
- `/api/ping` - API test endpoint
- `/api/demo` - Demo API endpoint

## Security Features

- Non-root user in container
- Graceful shutdown handling
- Health checks
- CORS enabled
- Static file serving with fallback to index.html

## Performance Optimizations

- Small Alpine Linux base image
- Production-only dependencies
- Optimized Docker build with .dockerignore
- Static file caching via Express
- Minified client bundles

The server now correctly starts on port 8080, serves the React app, provides API endpoints, and includes health checks as expected by Cloud Run.
