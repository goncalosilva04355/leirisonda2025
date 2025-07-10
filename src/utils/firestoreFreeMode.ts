// Run application without Firestore dependency

export const enableFirestoreFreeMode = () => {
  console.log("🔄 Enabling Firestore-free mode...");

  // Store in localStorage that we're running without Firestore
  localStorage.setItem("firestoreFreeMode", "true");
  localStorage.setItem("firestoreAvailable", "false");

  return {
    mode: "firestore-free",
    message:
      "Application running without Firestore - all features available except data persistence",
    dataStorage: "local-only",
  };
};

export const checkApplicationMode = () => {
  const firestoreFreeMode =
    localStorage.getItem("firestoreFreeMode") === "true";

  if (firestoreFreeMode) {
    console.log("📱 Application running in Firestore-free mode");
    return {
      hasFirestore: false,
      mode: "local-only",
      message: "App functional without Firestore",
    };
  }

  return {
    hasFirestore: null, // Unknown
    mode: "standard",
    message: "Attempting Firestore connection",
  };
};

// Mock data operations for local-only mode
export const createLocalDataManager = () => {
  console.log("💾 Creating local data manager...");

  const storage = {
    obras: JSON.parse(localStorage.getItem("local_obras") || "[]"),
    manutencoes: JSON.parse(localStorage.getItem("local_manutencoes") || "[]"),
    piscinas: JSON.parse(localStorage.getItem("local_piscinas") || "[]"),
    clientes: JSON.parse(localStorage.getItem("local_clientes") || "[]"),
    users: JSON.parse(localStorage.getItem("local_users") || "[]"),
  };

  const saveToLocal = (collection: string, data: any) => {
    storage[collection as keyof typeof storage] = data;
    localStorage.setItem(`local_${collection}`, JSON.stringify(data));
    console.log(`💾 Saved ${collection} locally:`, data.length, "items");
  };

  return {
    // Firestore-like API but using localStorage
    collection: (name: string) => ({
      get: () =>
        Promise.resolve({
          docs: storage[name as keyof typeof storage] || [],
          empty: (storage[name as keyof typeof storage] || []).length === 0,
        }),
      add: (data: any) => {
        const collection = storage[name as keyof typeof storage] || [];
        const newItem = {
          ...data,
          id: `local_${Date.now()}`,
          createdAt: new Date(),
        };
        collection.push(newItem);
        saveToLocal(name, collection);
        return Promise.resolve({ id: newItem.id });
      },
      doc: (id: string) => ({
        set: (data: any) => {
          const collection = storage[name as keyof typeof storage] || [];
          const index = collection.findIndex((item: any) => item.id === id);
          if (index >= 0) {
            collection[index] = { ...data, id, updatedAt: new Date() };
          } else {
            collection.push({ ...data, id, createdAt: new Date() });
          }
          saveToLocal(name, collection);
          return Promise.resolve();
        },
        get: () => {
          const collection = storage[name as keyof typeof storage] || [];
          const item = collection.find((item: any) => item.id === id);
          return Promise.resolve({
            exists: () => !!item,
            data: () => item,
          });
        },
        delete: () => {
          const collection = storage[name as keyof typeof storage] || [];
          const filteredCollection = collection.filter(
            (item: any) => item.id !== id,
          );
          saveToLocal(name, filteredCollection);
          return Promise.resolve();
        },
      }),
    }),

    // Get current data
    getData: (collection: string) =>
      storage[collection as keyof typeof storage] || [],

    // Clear all data
    clearAll: () => {
      Object.keys(storage).forEach((key) => {
        localStorage.removeItem(`local_${key}`);
      });
      console.log("🗑️ Cleared all local data");
    },
  };
};

// Summary of application state
export const getApplicationSummary = () => {
  const firestoreMode = checkApplicationMode();
  const localData = createLocalDataManager();

  return {
    firestore: firestoreMode,
    features: {
      authentication: "✅ Working (Firebase Auth)",
      navigation: "✅ Working (Full sidebar)",
      dataEntry: "✅ Working (Forms functional)",
      dataStorage:
        firestoreMode.hasFirestore === false
          ? "💾 Local only"
          : "🔍 Testing Firestore",
      reports: "✅ Working",
      userManagement: "✅ Working",
    },
    dataCount: {
      obras: localData.getData("obras").length,
      manutencoes: localData.getData("manutencoes").length,
      piscinas: localData.getData("piscinas").length,
      clientes: localData.getData("clientes").length,
    },
  };
};
