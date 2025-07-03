import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Obras from "./pages/Obras";
import NovaObra from "./pages/NovaObra";
import Clientes from "./pages/Clientes";
import Funcionarios from "./pages/Funcionarios";
import Relatorios from "./pages/Relatorios";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/obras" element={<Obras />} />
          <Route path="/obras/nova" element={<NovaObra />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Layout>
      <Toaster />
    </div>
  );
}

export default App;
