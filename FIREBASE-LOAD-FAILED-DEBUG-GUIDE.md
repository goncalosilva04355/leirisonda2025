# Firebase "Load Failed" & 403 Errors - Debugging Guide

## Current Errors Observed

```
❌ Load failed
❌ REST API: Erro ao guardar test/rest-api-test: Load failed
❌ REST API: Teste de escrita falhou
❌ REST API: AUTO-TESTE FALHOU
❌ REST API: Acesso negado (403) para [collections]: Verificar API key e regras de segurança do Firestore
```

## Error Analysis

### 1. "Load Failed" Error

**Meaning**: Network request completely failed before reaching Firebase
**Common Causes**:

- No internet connectivity
- CORS policy blocking requests
- Invalid Firebase project URL
- Firewall blocking Google services
- DNS resolution issues

### 2. HTTP 403 "Forbidden" Errors

**Meaning**: Request reached Firebase but was rejected
**Common Causes**:

- Invalid or missing API key
- Firestore security rules blocking access
- Firestore not enabled in Firebase project
- Wrong Firebase project

## Debugging Steps Applied

### 1. Enhanced Network Error Detection

Added specific handling for different network failure types:

```typescript
if (fetchError.message === "Load failed") {
  console.error("🌐 Erro de rede: Verificar conectividade ou CORS");
  console.error("🔍 Verificar se o projeto Firebase existe e está ativo");
  console.error("🔑 Verificar se a API key é válida");
}
```

### 2. Request Timeout Protection

Added 10-15 second timeouts to prevent hanging requests:

```typescript
signal: AbortSignal.timeout(10000), // 10 second timeout
```

### 3. Firebase Project Validation

Created validator to check if Firebase project and API key are valid:

```typescript
const validation = await validateFirebaseProject(PROJECT_ID, API_KEY);
```

### 4. Detailed Request Logging

Added comprehensive logging for all requests:

```typescript
console.log(`🚀 Fazendo requisição para: ${url.replace(API_KEY, "[API_KEY]")}`);
console.log(`📝 Response status: ${response.status} para ${collection}`);
```

## Solutions to Try

### Immediate Fixes (Most Likely)

1. **Set Real Firebase Environment Variables**:

   ```bash
   # In .env file
   VITE_FIREBASE_API_KEY=AIzaSy... # Your real API key
   VITE_FIREBASE_PROJECT_ID=leiria-1cfc9 # Your real project ID
   ```

2. **Enable Firestore in Firebase Console**:

   - Go to https://console.firebase.google.com
   - Select project `leiria-1cfc9`
   - Go to Firestore Database
   - Click "Create database" if not created

3. **Update Firestore Security Rules**:
   ```javascript
   // In Firebase Console > Firestore > Rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // For development only
       }
     }
   }
   ```

### Network Troubleshooting

1. **Check Internet Connectivity**:

   ```bash
   # Test if can reach Google services
   curl https://firestore.googleapis.com
   ```

2. **Test API Key Manually**:

   ```bash
   # Replace with your actual values
   curl "https://firestore.googleapis.com/v1/projects/leiria-1cfc9/databases/(default)/documents?key=YOUR_API_KEY"
   ```

3. **Check CORS Issues**:
   - Open browser dev tools
   - Look for CORS errors in console
   - Ensure requests are going to correct domain

### Project Configuration

1. **Verify Project Exists**:

   - Go to Firebase Console
   - Ensure `leiria-1cfc9` project exists and is active
   - Check project permissions

2. **Get Correct Configuration**:
   - Firebase Console > Project Settings > General
   - Copy Web App configuration
   - Ensure API key is not restricted

## New Debug Features

The application now provides:

- ✅ **Network failure detection** with specific error types
- ✅ **Request timeout protection** to prevent hanging
- ✅ **Firebase project validation** before making requests
- ✅ **Detailed logging** of all requests and responses
- ✅ **Specific guidance** for each error type

## Expected Debug Output

You should now see detailed logs like:

```
🚀 Fazendo requisição para: https://firestore.googleapis.com/v1/projects/leiria-1cfc9/...
📝 Response status: 403 para clientes
🔍 Firebase Project Validation Failed: API key inválida ou sem permissões
```

This will help identify the exact cause of the "Load failed" and 403 errors.

## Next Steps

1. Check the browser console for the new detailed error messages
2. Set proper environment variables based on the specific errors shown
3. Follow the specific guidance provided for each error type
4. Test again and report any remaining issues

The enhanced error handling will provide much clearer information about what's causing the connection failures.
