# Restore Guide - Leirisonda Configuration

## Firebase Project Details

- **Project Name:** Leirisonda
- **Project ID:** leirisonda-16f8b
- **API Key:** [MOVED TO ENV VAR VITE_LEIRISONDA_FIREBASE_API_KEY]
- **Status:** ✅ Active

## Configuration Notes

The Firebase configuration has been moved to environment variables for security purposes.

To restore the configuration:

1. Set the environment variable `VITE_LEIRISONDA_FIREBASE_API_KEY` with your Firebase API key
2. Use the existing `src/config/firebaseEnv.ts` helper to access the configuration
3. Ensure all other Firebase config parameters are properly set in environment variables

## Security

- All sensitive API keys have been removed from source code
- Configuration now uses environment variables exclusively
- Reference `NETLIFY_SETUP.md` for complete environment variable setup
