/**
 * Firebase-Only Service - DISABLED (Firestore not available)
 * Safe stub to prevent Firestore initialization errors
 */

console.log("🚫 FirebaseOnlyService disabled - Firestore not available");

export class FirebaseOnlyService {
  static async initialize(): Promise<boolean> {
    console.log("🚫 FirebaseOnlyService disabled - Firestore not available");
    return false;
  }

  static async getDatabase() {
    console.log("🚫 Database access disabled - Firestore not available");
    return null;
  }

  // Safe stubs for all methods to prevent import errors
  static async addWork(data: any) {
    console.log("🚫 AddWork disabled - using local storage");
    return null;
  }

  static async updateWork(id: string, data: any) {
    console.log("🚫 UpdateWork disabled - using local storage");
    return null;
  }

  static async deleteWork(id: string) {
    console.log("🚫 DeleteWork disabled - using local storage");
    return null;
  }

  static async getWorks() {
    console.log("🚫 GetWorks disabled - using local storage");
    return [];
  }
}
