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

  // Force no loading state - show login immediately
  // if (isLoading) removed to prevent infinite loading

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Modern Card Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="mx-auto w-28 h-28 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl p-2">
                <svg
                  width="96"
                  height="96"
                  viewBox="0 0 180 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-24 h-24"
                >
                  {/* Fundo com cores da Leirisonda */}
                  <rect width="180" height="180" rx="40" fill="#b30229" />

                  {/* Logo principal da Leirisonda */}
                  <circle cx="90" cy="90" r="65" fill="#007784" />

                  {/* Letra "L" estilizada da Leirisonda */}
                  <rect
                    x="65"
                    y="55"
                    width="12"
                    height="70"
                    fill="white"
                    rx="3"
                  />
                  <rect
                    x="65"
                    y="113"
                    width="40"
                    height="12"
                    fill="white"
                    rx="3"
                  />

                  {/* Elementos de construção/obra */}
                  <rect
                    x="85"
                    y="65"
                    width="25"
                    height="6"
                    fill="white"
                    opacity="0.9"
                    rx="2"
                  />
                  <rect
                    x="85"
                    y="78"
                    width="25"
                    height="6"
                    fill="white"
                    opacity="0.7"
                    rx="2"
                  />
                  <rect
                    x="85"
                    y="91"
                    width="25"
                    height="6"
                    fill="white"
                    opacity="0.5"
                    rx="2"
                  />

                  {/* Ferramentas/detalhes decorativos */}
                  <circle cx="115" cy="70" r="4" fill="white" opacity="0.8" />
                  <circle cx="120" cy="85" r="3" fill="white" opacity="0.6" />
                  <rect
                    x="115"
                    y="100"
                    width="12"
                    height="4"
                    fill="white"
                    opacity="0.7"
                    rx="1"
                  />

                  {/* Pontos decorativos no topo */}
                  <circle cx="75" cy="40" r="2.5" fill="white" opacity="0.6" />
                  <circle cx="105" cy="40" r="2.5" fill="white" opacity="0.6" />
                  <circle cx="90" cy="30" r="3" fill="white" opacity="0.8" />

                  {/* Base/fundação */}
                  <rect
                    x="50"
                    y="140"
                    width="80"
                    height="8"
                    fill="white"
                    opacity="0.9"
                    rx="2"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Leirisonda</h1>
              <p className="text-blue-100 opacity-90">
                Sistema de Gestão de Obras
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="p-8">
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
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm font-medium">
            © 2024 Leirisonda - Sistema Profissional de Gestão
          </p>
        </div>
      </div>
    </div>
  );
}
