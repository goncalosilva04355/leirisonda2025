import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Waves, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Login() {
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in (only when user exists)
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Email ou palavra-passe incorretos.");
      }
    } catch (err) {
      setError("Erro ao iniciar sessão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMobileDeploy = () => {
    const deployGuide = `📱 ATUALIZAR APP LEIRISONDA

🔄 Como atualizar para "Cubicagem de Água":

1. 🌐 Abre: https://app.netlify.com/drop
2. 📁 Faz upload da pasta leirisonda-deploy
3. ⏱️ Aguarda 2-3 minutos
4. 🔄 Refresh da app (puxa para baixo)
5. ✅ Testa: Nova Piscina → "Cubicagem de Água"

🆕 NOVIDADES:
- Sistema completo de manutenção
- Gestão de intervenções
- Formulários atualizados

App: https://leirisonda.netlify.app
Netlify: https://app.netlify.com/drop

Problemas? Contacta o desenvolvedor.`;

    const blob = new Blob([deployGuide], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leirisonda-update.txt";
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => {
      window.open("https://app.netlify.com/drop", "_blank");
    }, 500);

    alert("📱 Guia descarregado! A abrir Netlify...");
  };

  // Force no loading state - show login immediately
  // if (isLoading) removed to prevent infinite loading

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-32 h-20 bg-white rounded-xl flex items-center justify-center mb-6 shadow-lg p-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800"
              alt="Leirisonda Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Leirisonda</h1>
          <p className="text-blue-100 mb-8">Sistema de Gestão de Obras</p>
          {/* EMERGENCY PUSH - LEIRISONDA PRODUCTION READY NOW */}
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="mt-1 h-12"
                disabled={isSubmitting}
                style={{ height: "48px", fontSize: "16px" }}
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Palavra-passe
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 pr-12 h-12"
                  disabled={isSubmitting}
                  style={{ height: "48px", fontSize: "16px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>A entrar...</span>
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          {/* Mobile Deploy Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleMobileDeploy}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium h-12"
            >
              📱 Atualizar App (iPhone)
            </Button>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8">
          <p className="text-white/70 text-sm">
            © 2024 Leirisonda - Todos os direitos reservados. v1.0 - PROD READY
          </p>
        </div>
      </div>
    </div>
  );
}
