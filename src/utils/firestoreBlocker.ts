/**
 * Comprehensive Firestore Blocker
 * Prevents any Firestore initialization or import attempts
 */

// Block at import level
export const FIRESTORE_DISABLED = true;

// Safe mock functions
const createSafeMock = (name: string) => {
  return (...args: any[]) => {
    console.warn(`🚫 ${name} blocked - Firestore disabled`);
    return null;
  };
};

// Export safe mocks for common Firestore functions
export const getFirestore = createSafeMock("getFirestore");
export const initializeFirestore = createSafeMock("initializeFirestore");
export const connectFirestoreEmulator = createSafeMock(
  "connectFirestoreEmulator",
);
export const collection = createSafeMock("collection");
export const doc = createSafeMock("doc");
export const addDoc = createSafeMock("addDoc");
export const setDoc = createSafeMock("setDoc");
export const updateDoc = createSafeMock("updateDoc");
export const deleteDoc = createSafeMock("deleteDoc");
export const getDoc = createSafeMock("getDoc");
export const getDocs = createSafeMock("getDocs");
export const onSnapshot = createSafeMock("onSnapshot");
export const query = createSafeMock("query");
export const where = createSafeMock("where");
export const orderBy = createSafeMock("orderBy");
export const limit = createSafeMock("limit");

// Mock Firestore classes
export class Firestore {
  constructor() {
    console.warn("🚫 Firestore class blocked - service disabled");
  }
}

export class DocumentReference {
  constructor() {
    console.warn("🚫 DocumentReference class blocked - service disabled");
  }
}

export class CollectionReference {
  constructor() {
    console.warn("🚫 CollectionReference class blocked - service disabled");
  }
}

// Default export as disabled Firestore
export default {
  getFirestore,
  initializeFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  FIRESTORE_DISABLED: true,
};

console.log("🚫 Firestore blocker loaded - all Firestore functions disabled");
