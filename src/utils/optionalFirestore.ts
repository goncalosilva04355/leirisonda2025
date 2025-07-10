// Make Firestore optional so the app works without it

export const createOptionalFirestore = async () => {
  const result = {
    available: false,
    instance: null as any,
    error: null as string | null,
    message: "",
  };

  try {
    // Try to get existing Firebase app
    const { getApps } = await import("firebase/app");
    const apps = getApps();

    if (apps.length === 0) {
      result.error = "No Firebase app found";
      result.message = "Firebase app not initialized";
      return result;
    }

    const app = apps[0];
    console.log("📱 Using Firebase app:", app.options.projectId);

    // Try to initialize Firestore
    try {
      const { getFirestore } = await import("firebase/firestore");
      const db = getFirestore(app);

      result.available = true;
      result.instance = db;
      result.message = "Firestore available and ready";
      console.log("✅ Firestore is available");
    } catch (firestoreError: any) {
      result.error = firestoreError.message;

      if (firestoreError.message.includes("not available")) {
        result.message = `Firestore not enabled in project ${app.options.projectId}. App will work without it.`;
        console.log("⚠️ Firestore not enabled, but app can continue");
      } else {
        result.message = `Firestore error: ${firestoreError.message}`;
        console.log("❌ Firestore error:", firestoreError.message);
      }
    }
  } catch (error: any) {
    result.error = error.message;
    result.message = `Firebase error: ${error.message}`;
  }

  return result;
};

// Mock Firestore operations for when Firestore is not available
export const createMockFirestore = () => {
  console.log("🔄 Creating mock Firestore for offline operation");

  return {
    collection: (path: string) => ({
      doc: (id: string) => ({
        set: async (data: any) => {
          console.log(`📝 Mock: Would save to ${path}/${id}:`, data);
          return Promise.resolve();
        },
        get: async () => {
          console.log(`📖 Mock: Would read from ${path}/${id}`);
          return Promise.resolve({
            exists: () => false,
            data: () => undefined,
          });
        },
      }),
      add: async (data: any) => {
        console.log(`➕ Mock: Would add to ${path}:`, data);
        return Promise.resolve({ id: `mock_${Date.now()}` });
      },
      get: async () => {
        console.log(`📋 Mock: Would list ${path}`);
        return Promise.resolve({
          docs: [],
          empty: true,
          size: 0,
        });
      },
    }),
  };
};

// Safe Firestore hook that works with or without Firestore
export const useSafeFirestore = () => {
  const [firestore, setFirestore] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initFirestore = async () => {
      const result = await createOptionalFirestore();

      if (result.available && result.instance) {
        setFirestore(result.instance);
        setIsAvailable(true);
        console.log("✅ Using real Firestore");
      } else {
        setFirestore(createMockFirestore());
        setIsAvailable(false);
        console.log("🔄 Using mock Firestore");
      }

      setIsLoading(false);
    };

    initFirestore();
  }, []);

  return {
    firestore,
    isAvailable,
    isLoading,
    isMock: !isAvailable,
  };
};
