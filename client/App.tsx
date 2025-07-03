import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Obras from "./pages/Obras";
import Clientes from "./pages/Clientes";
import Funcionarios from "./pages/Funcionarios";
import Relatorios from "./pages/Relatorios";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando Leirisonda...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="leirisonda-theme">
        <Login />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="leirisonda-theme">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/obras" element={<Obras />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Layout>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
