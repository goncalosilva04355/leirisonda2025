/**
 * Simple emergency logout utility to force logout all users immediately
 * This version has minimal dependencies to avoid TypeScript conflicts
 */

export const simpleEmergencyLogout = async (): Promise<void> => {
  try {
    console.log(
      "🚨 SIMPLE EMERGENCY LOGOUT: Starting immediate logout of all users",
    );

    // Step 1: Clear ALL localStorage
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
    console.log(`🗑️ Cleared ${allKeys.length} localStorage keys`);

    // Step 2: Clear ALL sessionStorage
    sessionStorage.clear();
    console.log("🗑️ Cleared all sessionStorage");

    // Step 3: Clear ALL cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    console.log("🍪 Cleared all cookies");

    // Step 4: Clear IndexedDB (Firebase tokens)
    try {
      if ("indexedDB" in window) {
        const databases = await indexedDB.databases();
        for (const db of databases) {
          if (db.name) {
            const deleteReq = indexedDB.deleteDatabase(db.name);
            await new Promise((resolve, reject) => {
              deleteReq.onsuccess = () => resolve(true);
              deleteReq.onerror = () => reject(deleteReq.error);
            });
            console.log(`🗃️ Cleared IndexedDB: ${db.name}`);
          }
        }
      }
    } catch (error) {
      console.warn("⚠️ Could not clear IndexedDB:", error);
    }

    // Step 5: Force Firebase logout
    try {
      // Import Firebase auth dynamically to avoid dependency issues
      const { getAuth, signOut } = await import("firebase/auth");
      const auth = getAuth();
      if (auth && auth.currentUser) {
        await signOut(auth);
        console.log("🔥 Firebase user signed out");
      }
    } catch (error) {
      console.warn("⚠️ Could not sign out Firebase user:", error);
    }

    // Step 6: Recreate only super admin
    const superAdmin = {
      id: 1,
      name: "Gonçalo Fonseca",
      email: "gongonsilva@gmail.com",
      password: "19867gsf",
      role: "super_admin",
      permissions: {
        obras: { view: true, create: true, edit: true, delete: true },
        manutencoes: { view: true, create: true, edit: true, delete: true },
        piscinas: { view: true, create: true, edit: true, delete: true },
        utilizadores: { view: true, create: true, edit: true, delete: true },
        relatorios: { view: true, create: true, edit: true, delete: true },
        clientes: { view: true, create: true, edit: true, delete: true },
      },
      active: true,
      createdAt: "2024-01-01",
    };

    localStorage.setItem("app-users", JSON.stringify([superAdmin]));
    localStorage.setItem(
      "mock-users",
      JSON.stringify([
        {
          uid: "admin-1",
          email: "gongonsilva@gmail.com",
          password: "19867gsf",
          name: "Gonçalo Fonseca",
          role: "super_admin",
          active: true,
          createdAt: new Date().toISOString(),
        },
      ]),
    );

    console.log("🛡️ Super admin recreated");

    // Step 7: Set flags to prevent auto-login
    localStorage.setItem("emergencyLogoutActive", "true");
    localStorage.setItem("autoLoginDisabled", "true");

    console.log("✅ SIMPLE EMERGENCY LOGOUT COMPLETED!");

    // No alert message to avoid persistent popups
  } catch (error: any) {
    console.error("❌ Simple emergency logout failed:", error);
    alert(`❌ Emergency logout falhou: ${error.message}`);
  }
};

// Available for manual execution only
export default simpleEmergencyLogout;
