# Firebase 403 Error - Targeted Fix

## Issue

```
❌ REST API: Acesso negado (403) para test: Verificar API key e regras de segurança do Firestore
```

## Root Cause

HTTP 403 "Forbidden" means Firebase is rejecting the request due to:

1. **Invalid/placeholder API key** (`demo-value-set-for-production`)
2. **Firestore security rules** blocking all access
3. **Firestore not enabled** in the Firebase project

## Targeted Solution Applied

### 1. Enhanced 403 Error Guidance

When a 403 occurs, the application now provides step-by-step solutions:

```typescript
console.error("🔑 SOLUÇÃO PARA 403:");
console.error("1. 🔄 Definir variáveis de ambiente reais:");
console.error("   VITE_FIREBASE_API_KEY=sua_chave_real_aqui");
console.error("   VITE_FIREBASE_PROJECT_ID=leiria-1cfc9");
console.error("2. 🔒 Atualizar regras Firestore (Firebase Console):");
console.error("   allow read, write: if true; // Para desenvolvimento");
```

### 2. Automatic Diagnostic Tool

Created `firebase403Diagnostic.ts` that runs automatically on 403 errors and checks:

- ✅ PROJECT_ID configuration
- ✅ API_KEY format and validity
- ✅ Environment detection
- ✅ Specific solutions for each issue found

### 3. Placeholder Detection

Specifically detects and warns about placeholder values:

```typescript
if (PROJECT_ID === "demo-value-set-for-production") {
  console.error(
    "⚠️ PROBLEMA: Usando valores placeholder em vez de configuração real!",
  );
  console.error(
    "🛠️ SOLUÇÃO: Definir VITE_FIREBASE_PROJECT_ID com o ID real do projeto",
  );
}
```

## Quick Fix Steps

**Most likely solution** - Replace placeholder values:

1. **Create `.env` file** in project root:

   ```bash
   VITE_FIREBASE_API_KEY=AIzaSy...your_real_key
   VITE_FIREBASE_PROJECT_ID=leiria-1cfc9
   VITE_FIREBASE_AUTH_DOMAIN=leiria-1cfc9.firebaseapp.com
   ```

2. **Update Firestore Rules** (Firebase Console > Firestore > Rules):

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // Development only
       }
     }
   }
   ```

3. **Restart development server**:
   ```bash
   npm run dev
   ```

## Expected Outcome

After applying the fix, you should see:

- ✅ No more 403 errors
- ✅ Successful REST API calls
- ✅ Data reading/writing to Firestore collections

The diagnostic tool will continue to run and provide guidance if other configuration issues are detected.

## For Production Deployment

Set the same environment variables in your Netlify dashboard:

- Site Settings → Environment Variables
- Add `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_PROJECT_ID`
- Use secure Firestore rules with authentication

The 403 error should be resolved once the Firebase configuration uses real values instead of placeholders.
