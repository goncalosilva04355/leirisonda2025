# Firestore 403 Error Troubleshooting Guide

## Issue

Getting HTTP 403 (Forbidden) errors when accessing Firestore collections via REST API:

```
❌ REST API: Erro ao ler resposta para obras: text@[native code]
Response status: 403
```

## What 403 Errors Mean

A 403 Forbidden error in Firestore means:

1. **Invalid API Key** - The API key is incorrect or not properly configured
2. **Missing API Key** - No API key provided in the request
3. **Firestore Security Rules** - The security rules are blocking access
4. **Firestore Not Enabled** - Firestore database is not enabled in the Firebase project

## Common Causes & Solutions

### 1. API Key Issues

**Problem**: Using placeholder values like "demo-value-set-for-production"
**Solution**: Set proper environment variables:

```bash
VITE_FIREBASE_API_KEY=your_real_api_key_here
VITE_FIREBASE_PROJECT_ID=your_real_project_id
```

### 2. Firestore Security Rules

**Problem**: Default Firestore rules block all reads/writes
**Solution**: Update Firestore rules in Firebase Console:

**For Development (Allow All - NOT for production):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**For Production (Secure Rules):**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clientes/{document} {
      allow read, write: if request.auth != null;
    }
    match /obras/{document} {
      allow read, write: if request.auth != null;
    }
    match /manutencoes/{document} {
      allow read, write: if request.auth != null;
    }
    match /piscinas/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Firestore Not Enabled

**Problem**: Firestore database hasn't been created
**Solution**:

1. Go to Firebase Console
2. Navigate to your project
3. Go to Firestore Database
4. Click "Create database"
5. Choose production or test mode

### 4. Wrong Project Configuration

**Problem**: API key belongs to different project
**Solution**: Verify in Firebase Console:

1. Go to Project Settings → General
2. Check that the API key matches your project
3. Ensure the project ID is correct

## How to Debug

### 1. Check Console Logs

Look for these messages:

```
⚠️ REST API: PROJECT_ID não configurado corretamente: demo-value-set-for-production
⚠️ REST API: API_KEY não configurado corretamente
```

### 2. Test API Key

Try this REST API call manually:

```bash
curl "https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/test?key=YOUR_API_KEY"
```

### 3. Check Firestore Rules

In Firebase Console → Firestore → Rules, check if rules allow your operations.

## Quick Fix for Development

1. **Set Environment Variables** (most common fix):

   ```bash
   # In .env file
   VITE_FIREBASE_API_KEY=AIzaSy...your_real_key
   VITE_FIREBASE_PROJECT_ID=your-project-id
   ```

2. **Allow All Access** (development only):

   ```javascript
   // In Firestore Rules
   allow read, write: if true;
   ```

3. **Restart Application** after setting environment variables

## For Production Deployment

1. Set environment variables in Netlify dashboard
2. Use secure Firestore rules with authentication
3. Test with proper user authentication

The 403 errors should resolve once the Firebase configuration and security rules are properly set up.
