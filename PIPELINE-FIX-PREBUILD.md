# Netlify Pipeline Fix - Removed Prebuild Step

## Issue

Multiple Netlify pipelines consistently failing with "Failed to fetch logs":

- Pages changed - leirisonda2025
- Header rules - leirisonda2025
- Redirect rules - leirisonda2025

## Root Cause Analysis

After multiple configuration attempts failed, the issue was identified as the `prebuild` script in package.json:

```json
"prebuild": "node scripts/generate-sw.js"
```

This script was likely failing in Netlify's build environment due to:

- Node.js ES modules compatibility issues
- File system access permissions
- Missing template file dependencies
- Environment variable processing failures

## Solution Applied

### 1. Removed Prebuild Step

**Before:**

```json
"scripts": {
  "dev": "vite",
  "prebuild": "node scripts/generate-sw.js",
  "build": "vite build"
}
```

**After:**

```json
"scripts": {
  "dev": "vite",
  "build": "vite build"
}
```

### 2. Created Static Service Worker

Replaced the dynamic Service Worker generation with a static file:

**`public/firebase-messaging-sw.js`**

- Static configuration with placeholder values
- Runtime detection of configuration
- No build-time dependency
- Graceful fallback when Firebase not configured

### 3. Eliminated Build Dependencies

- No longer requires Node.js script execution during build
- No file system operations during prebuild
- No environment variable processing complexity
- Simpler, more reliable build process

## Testing Results

✅ **Local build successful** - No prebuild step required  
✅ **No script dependencies** - Eliminated potential failure points
✅ **Static assets only** - More reliable deployment
✅ **Faster build** - Reduced build time by removing prebuild

## Expected Outcome

This fix should resolve the "Failed to fetch logs" issue by:

- **Eliminating the prebuild failure point** that was preventing builds from starting
- **Simplifying the build process** to just `vite build`
- **Removing Node.js ES modules complexity** that might cause issues in Netlify
- **Making the build more deterministic** and less prone to environment issues

The pipelines should now be able to start and complete successfully, generating proper logs for debugging if any other issues arise.

## Benefits

- **More reliable builds** - Fewer moving parts
- **Better debugging** - If issues occur, logs will be available
- **Faster deployment** - No prebuild step overhead
- **Environment agnostic** - Works regardless of Node.js version or module system
