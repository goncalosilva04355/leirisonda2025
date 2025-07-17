# Deployment Environment Setup Guide

## Secrets Scanning Fix

This guide explains how to resolve the Netlify secrets scanning errors and deploy your application securely.

## Problem Solved

✅ Removed all hardcoded Firebase API keys from source code  
✅ Migrated to environment variables  
✅ Added Netlify secrets scanning configuration  
✅ Created secure build process

## Environment Variables Required

Set these environment variables in your Netlify dashboard (Site Settings > Environment Variables):

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=1:your_messaging_sender_id:web:your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID
```

## How to Get Firebase Values

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings → General
4. In "Your apps" section, find your web app configuration
5. Copy each value to the corresponding environment variable

## Netlify Configuration

The `netlify.toml` file has been configured to:

- Handle secrets scanning properly
- Allow Firebase client-side API keys (which are meant to be public)
- Set up proper redirects and security headers

## Local Development

1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values
3. Run `npm run dev`

## Build Process

The build process now:

1. Generates Service Worker with environment variables (`prebuild` script)
2. Builds the application with Vite
3. Replaces all hardcoded values with environment variables

## Security Notes

- Firebase client-side API keys are meant to be public
- Security is handled by Firebase security rules
- Environment variables are injected at build time
- No secrets are exposed in the source code

## Troubleshooting

If build still fails:

1. Verify all environment variables are set in Netlify
2. Check that variable names match exactly (case-sensitive)
3. Redeploy after setting variables
4. Check build logs for specific errors

## Files Modified

- ✅ All Firebase configuration files updated
- ✅ Service Worker generation automated
- ✅ Component files updated
- ✅ Utility files updated
- ✅ Netlify configuration added

Your application should now deploy successfully without secrets scanning errors.
