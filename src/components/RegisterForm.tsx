import React, { useState } from "react";
import { authService } from "../services/authService";

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onBackToLogin,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "technician" as "super_admin" | "manager" | "technician",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    // Add small delay to ensure UI updates
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Validation
    if (!formData.name.trim()) {
      setError("Nome é obrigatório");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Por favor, insira um email válido");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords não coincidem");
      setLoading(false);
      return;
    }

    try {
      const result = await authService.register(
        formData.email.trim(),
        formData.password,
        formData.name.trim(),
        formData.role,
      );

      if (result.success) {
        onRegisterSuccess();
      } else {
        setError(result.error || "Erro ao criar conta");
      }
    } catch (error: any) {
      console.error("Unexpected registration error:", error);
      if (error.message && error.message.includes("Firebase")) {
        setError("Erro de configuração Firebase. Contacte o administrador.");
      } else {
        setError("Erro inesperado. Verifique a conexão e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user types
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Criar Conta</h2>
            <p className="text-gray-600 mt-2">
              Preencha os dados para criar uma nova conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Função
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  handleInputChange(
                    "role",
                    e.target.value as "super_admin" | "manager" | "technician",
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="technician">Técnico</option>
                <option value="manager">Gestor</option>
                <option value="super_admin">Super Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Repita a password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? "A criar conta..." : "Criar Conta"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Voltar ao Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
