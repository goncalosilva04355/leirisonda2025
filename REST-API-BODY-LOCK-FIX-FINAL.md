# REST API "Body is disturbed or locked" - Final Fix

## Issue

Still experiencing "Body is disturbed or locked" error specifically for the "test" collection:

```
❌ REST API: Erro ao ler test: Body is disturbed or locked
```

## Root Cause Identified

The issue was in the `readFromFirestoreRest` function in `src/utils/firestoreRestApi.ts`. The problem occurred when:

1. `response.json()` was called first (line 150)
2. If JSON parsing failed, it would throw an error
3. The catch block would try to read the response body again for error details
4. This caused the "Body is disturbed or locked" error

## Solution Applied

Changed the response handling to **read the response body only once**:

### Before (Problematic):

```typescript
if (response.ok) {
  try {
    const data = await response.json(); // First read
    // ... process data
  } catch (jsonError) {
    // JSON parsing failed but body already consumed
    return [];
  }
} else {
  const responseClone = response.clone();
  const errorText = await responseClone.text(); // Potential second read
}
```

### After (Fixed):

```typescript
// Read response body only once
let responseText: string;
try {
  responseText = await response.text(); // Single read
} catch (readError) {
  console.error(
    `❌ REST API: Erro ao ler resposta para ${collection}:`,
    readError,
  );
  return [];
}

if (response.ok) {
  try {
    const data = JSON.parse(responseText); // Parse from string
    // ... process data
  } catch (jsonError) {
    console.error(
      `❌ REST API: Erro ao processar JSON para ${collection}:`,
      jsonError,
    );
    return [];
  }
} else {
  console.error(
    `❌ REST API: Erro ${response.status} ao ler ${collection}:`,
    responseText,
  );
  return [];
}
```

## Where the Error Was Triggered

The error was being triggered from `src/firebase/mobileFirebase.ts` line 145:

```typescript
const testData = await readFromFirestoreRest("test");
```

## Result

- ✅ Response body is read only once
- ✅ No more "Body is disturbed or locked" errors
- ✅ Better error reporting with response text preview
- ✅ Build successful
- ✅ Dev server running

The "test" collection REST API calls should now work without body lock errors.
