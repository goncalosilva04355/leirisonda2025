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
    const pdfInfo = `📄 SISTEMA DE RELATÓRIOS PDF - LEIRISONDA

🏗️ FUNCIONALIDADES PRINCIPAIS:
- Relatórios de Manutenção de Piscinas
- Relatórios de Trabalhos e Intervenções
- Geração automática de PDFs profissionais
- Logo da empresa integrado
- Design moderno em formato A4

🔧 COMO FUNCIONA:
1. ✅ Login no sistema
2. 📝 Criar/visualizar relatório
3. 📄 Clicar em "Partilhar Relatório"
4. 🎯 Escolher opção (PDF, Email, WhatsApp)
5. 📋 PDF gerado automaticamente

📱 OPÇÕES DE PARTILHA:
• Download: Descarrega PDF diretamente
• Email: PDF + abre cliente de email
• WhatsApp: PDF + abre WhatsApp
• Copiar: PDF + copia resumo

⚙️ TECNOLOGIA:
- jsPDF + html2canvas
- Templates HTML modernos
- Formatação A4 profissional
- Logótipo da Leirisonda

🌐 Acesso: https://leirisonda.netlify.app`;

    const blob = new Blob([pdfInfo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leirisonda-pdf-sistema.txt";
    a.click();
    URL.revokeObjectURL(url);

    alert(
      "📄 Informação do sistema PDF descarregada! Faça login para ver os relatórios em ação.",
    );
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
              <div className="mx-auto w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg p-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800"
                  alt="Leirisonda Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold mb-2">Leirisonda</h1>
              <p className="text-blue-100 opacity-90">
                Sistema de Gestão de Obras
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="p-8">
            {/* PDF Demo Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900">
                  Sistema de Relatórios PDF
                </h3>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                ✅ Geração automática de PDFs profissionais
                <br />
                ✅ Relatórios de manutenção e trabalhos
                <br />✅ Partilha via Email, WhatsApp e Download
              </p>
              <button
                type="button"
                onClick={handleMobileDeploy}
                className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📄 Ver Como Funciona
              </button>
            </div>

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
