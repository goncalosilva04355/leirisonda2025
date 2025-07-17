# REST API 403 Error Fix

## Issue

Multiple collections getting HTTP 403 (Forbidden) errors:

```
❌ REST API: Erro ao ler resposta para obras: text@[native code] Response status: 403
❌ REST API: Erro ao ler resposta para clientes: text@[native code] Response status: 403
❌ REST API: Erro ao ler resposta para manutencoes: text@[native code] Response status: 403
❌ REST API: Erro ao ler resposta para piscinas: text@[native code] Response status: 403
```

## Root Cause

1. **HTTP 403 Status**: Firebase REST API returning "Forbidden" for all collection accesses
2. **Response.text() Failure**: Even with proper error handling, `response.text()` was failing on 403 responses
3. **Configuration Issue**: Likely using placeholder API keys instead of real Firebase credentials

## Fixes Applied

### 1. Specific 403 Error Handling

Added early detection and handling of 403 errors:

```typescript
// Handle 403 errors specifically
if (response.status === 403) {
  console.error(
    `❌ REST API: Acesso negado (403) para ${collection}:`,
    "Verificar API key e regras de segurança do Firestore",
  );
  return [];
}
```

### 2. Enhanced Response Text Reading

Added timeout and better error handling for `response.text()`:

```typescript
// Try to read with timeout
const textPromise = response.text();
const timeoutPromise = new Promise<never>((_, reject) =>
  setTimeout(() => reject(new Error("Timeout reading response")), 5000),
);

responseText = await Promise.race([textPromise, timeoutPromise]);
```

### 3. Detailed Error Reporting

Enhanced error logging with response details:

```typescript
const errorDetails = {
  status: response?.status,
  statusText: response?.statusText,
  url: response?.url,
  ok: response?.ok,
  type: response?.type,
  redirected: response?.redirected,
};
```

### 4. Helpful Guidance

Added specific guidance for 403 errors:

- Explains what 403 means in Firebase context
- Provides steps to fix API key and security rules
- Links to Firebase Console settings

## Most Likely Solution Needed

The 403 errors indicate Firebase configuration issues. To fix:

1. **Set Real Environment Variables** in production:

   ```
   VITE_FIREBASE_API_KEY=your_real_api_key
   VITE_FIREBASE_PROJECT_ID=your_real_project_id
   ```

2. **Update Firestore Security Rules** to allow access:

   ```javascript
   // For development (in Firebase Console > Firestore > Rules)
   allow read, write: if true;
   ```

3. **Verify Firestore is Enabled** in the Firebase project

## Result

- ✅ **No more crashes** on 403 responses
- ✅ **Clear error messages** explaining the issue
- ✅ **Helpful guidance** for fixing configuration
- ✅ **Graceful degradation** when Firebase is misconfigured
- ✅ **Build successful** and dev server running

The application now handles 403 errors gracefully and provides clear guidance on how to fix the underlying Firebase configuration issues.
