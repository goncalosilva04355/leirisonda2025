// Debug wrapper for save function calls to track invalid documentId sources

import { saveToFirestoreRest } from "./firestoreRestApi";

// Enhanced save function with debugging
export async function debugSaveToFirestoreRest(
  collection: string,
  documentId: any, // Accept any type to debug
  data: any,
): Promise<boolean> {
  // Log the call with stack trace for debugging
  console.log("🔍 DEBUG Save Call:");
  console.log("  Collection:", collection);
  console.log("  DocumentId:", documentId);
  console.log("  DocumentId Type:", typeof documentId);
  console.log("  Data:", data);

  // Capture call stack for debugging
  const stack = new Error().stack;
  if (stack) {
    const lines = stack.split("\n").slice(1, 4); // Get top 3 stack frames
    console.log("📍 Call Stack:");
    lines.forEach((line, index) => {
      console.log(`  ${index + 1}. ${line.trim()}`);
    });
  }

  // Validate and fix documentId
  let fixedDocumentId: string;

  if (typeof documentId === "string") {
    fixedDocumentId = documentId;
  } else if (typeof documentId === "object" && documentId !== null) {
    console.warn("⚠️ Object passed as documentId, attempting to fix...");

    if (documentId.id) {
      fixedDocumentId = String(documentId.id);
      console.log(`🔧 Using documentId.id: ${fixedDocumentId}`);
    } else if (documentId.email) {
      fixedDocumentId = String(documentId.email);
      console.log(`🔧 Using documentId.email: ${fixedDocumentId}`);
    } else if (documentId.name) {
      fixedDocumentId = String(documentId.name);
      console.log(`🔧 Using documentId.name: ${fixedDocumentId}`);
    } else {
      // Try to stringify the object
      try {
        const objKeys = Object.keys(documentId);
        console.log("🔍 Available object keys:", objKeys);

        if (objKeys.length > 0) {
          const firstKey = objKeys[0];
          fixedDocumentId = String(documentId[firstKey]);
          console.log(`🔧 Using first key (${firstKey}): ${fixedDocumentId}`);
        } else {
          console.error("❌ Empty object passed as documentId");
          return false;
        }
      } catch (error) {
        console.error("❌ Could not extract string from object:", error);
        return false;
      }
    }
  } else if (documentId !== null && documentId !== undefined) {
    fixedDocumentId = String(documentId);
    console.log(`🔧 Converted to string: ${fixedDocumentId}`);
  } else {
    console.error("❌ DocumentId is null or undefined");
    return false;
  }

  // Call the actual save function with fixed parameters
  return saveToFirestoreRest(collection, fixedDocumentId, data);
}

// Export both functions
export { saveToFirestoreRest };
export default debugSaveToFirestoreRest;
