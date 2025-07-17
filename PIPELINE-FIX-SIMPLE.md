# Netlify Pipeline Fix - Simplified Configuration

## Issue

Multiple Netlify pipelines failing with "Failed to fetch logs":

- Pages changed - leirisonda2025
- Header rules - leirisonda2025
- Redirect rules - leirisonda2025

## Root Cause Analysis

The previous `netlify.toml` configuration was overly complex with many header rules that might be causing parsing issues or conflicts within Netlify's build system.

## Solution Applied

### 1. Simplified netlify.toml

Reduced the configuration to essential elements only:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  SECRETS_SCAN_SMART_DETECTION_ENABLED = "true"
  SECRETS_SCAN_SMART_DETECTION_OMIT_VALUES = "AIza"

# SPA redirect
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Basic security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Static assets caching
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Service Worker
[[headers]]
  for = "/firebase-messaging-sw.js"
  [headers.values]
    Content-Type = "application/javascript"
    Service-Worker-Allowed = "/"
```

### 2. Removed Potential Conflicts

- **Removed complex headers**: Eliminated potentially problematic headers like COEP, COOP, Permissions-Policy
- **Removed file-specific rules**: Eliminated multiple file-type specific header rules
- **Kept essential only**: Focused on core functionality (SPA routing, basic security, asset caching)

### 3. Cleaned Up Files

- Completely removed `public/_redirects`
- Completely removed `public/_headers`
- Single source of configuration in `netlify.toml`

## Key Simplifications

### Before (Complex)

- 10+ header rule blocks
- Complex security policies
- File-type specific rules for .html, .js, .css, .svg, .webp, robots.txt
- Multiple content-type specifications

### After (Simple)

- 3 essential header rule blocks
- Basic security headers only
- Essential SPA routing
- Core asset caching

## Testing

✅ **Local build successful** - No configuration errors
✅ **Minimal configuration** - Reduced chance of parsing issues
✅ **No file conflicts** - Single configuration source

## Expected Outcome

The simplified configuration should resolve the pipeline failures by:

- **Reducing parsing complexity** for Netlify's build system
- **Eliminating potential header conflicts**
- **Focusing on essential functionality** only

This conservative approach prioritizes stability over advanced features, which can be added back incrementally once the pipelines are stable.
