import React, { useState } from "react";
import { LoginPageFixed as LoginPage } from "./pages/LoginPageFixed";
import UnifiedAdminPageSimple from "./components/UnifiedAdminPageSimple";
import { authServiceWrapperSafe as authService } from "./services/authServiceWrapperSafe";

function AppMinimal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginError, setLoginError] = useState("");

  // Mock data for testing
  const mockData = {
    pools: [],
    works: [],
    maintenance: [],
    clients: [],
    users: [],
  };

  const handleLogin = async (
    email: string,
    password: string,
    rememberMe: boolean = false,
  ) => {
    setLoginError("");

    try {
      const result = await authService.login(email, password, rememberMe);

      if (result.success && result.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        console.log("✅ Login successful:", result.user);
      } else {
        setLoginError(result.error || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setLoginError("Erro de sistema. Tente novamente.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    authService.logout();
  };

  // Mock functions
  const mockSettings = {
    enablePhoneDialer: false,
    enableMapsRedirect: false,
    togglePhoneDialer: (enabled: boolean) =>
      console.log("Toggle phone dialer:", enabled),
    toggleMapsRedirect: (enabled: boolean) =>
      console.log("Toggle maps redirect:", enabled),
    handleDataCleanup: () => console.log("Data cleanup"),
    cleanupLoading: false,
    cleanupError: null,
    generateReport: (type: string) => console.log("Generate report:", type),
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoginPage
          onLogin={handleLogin}
          loginError={loginError}
          isLoading={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Leirisonda - Minimal</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <UnifiedAdminPageSimple
          currentUser={currentUser}
          onBack={() => console.log("Back clicked")}
          pools={mockData.pools}
          works={mockData.works}
          maintenance={mockData.maintenance}
          clients={mockData.clients}
          users={mockData.users}
          enablePhoneDialer={mockSettings.enablePhoneDialer}
          enableMapsRedirect={mockSettings.enableMapsRedirect}
          togglePhoneDialer={mockSettings.togglePhoneDialer}
          toggleMapsRedirect={mockSettings.toggleMapsRedirect}
          handleDataCleanup={mockSettings.handleDataCleanup}
          cleanupLoading={mockSettings.cleanupLoading}
          cleanupError={mockSettings.cleanupError}
          generateReport={mockSettings.generateReport}
        />
      </div>
    </div>
  );
}

export default AppMinimal;
