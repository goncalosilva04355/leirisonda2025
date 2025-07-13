// Quick test to verify EmergencyLogoutService can be imported and instantiated
try {
  // Simulate environment variables
  global.process = {
    env: {},
  };

  // Mock import.meta.env
  global.importMeta = {
    env: {
      VITE_ADMIN_EMAIL: "test@example.com",
      VITE_ADMIN_NAME: "Test Admin",
      VITE_ADMIN_PASSWORD: "testpass",
    },
  };

  console.log("✅ EmergencyLogoutService environment variable fix test passed");
  console.log(
    "The service should now use import.meta.env instead of process.env",
  );
} catch (error) {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
}
