import React, { useState, useEffect } from "react";
import { Phone, Settings, Check, X } from "lucide-react";

export const PhoneSettings: React.FC = () => {
  const [enablePhoneDialer, setEnablePhoneDialer] = useState(() => {
    return localStorage.getItem("enablePhoneDialer") === "true";
  });

  const [enableMapsRedirect, setEnableMapsRedirect] = useState(() => {
    return localStorage.getItem("enableMapsRedirect") === "true";
  });

  const [testNumber, setTestNumber] = useState("+351 912 345 678");
  const [testAddress, setTestAddress] = useState(
    "Quinta da Marinha, Cascais, Portugal",
  );
  const [testResult, setTestResult] = useState<string | null>(null);

  const togglePhoneDialer = (enabled: boolean) => {
    setEnablePhoneDialer(enabled);
    localStorage.setItem("enablePhoneDialer", enabled.toString());

    // Trigger a custom event to notify the main app
    window.dispatchEvent(
      new CustomEvent("phoneDialerToggled", {
        detail: { enabled },
      }),
    );
  };

  const toggleMapsRedirect = (enabled: boolean) => {
    setEnableMapsRedirect(enabled);
    localStorage.setItem("enableMapsRedirect", enabled.toString());

    // Trigger a custom event to notify the main app
    window.dispatchEvent(
      new CustomEvent("mapsRedirectToggled", {
        detail: { enabled },
      }),
    );
  };

  const testPhoneDialer = () => {
    if (!enablePhoneDialer) {
      setTestResult("❌ Marcação automática está desativada");
      return;
    }

    try {
      // Clean phone number
      const cleanPhone = testNumber.replace(/[\s\-\(\)]/g, "");

      // Test if it's a valid phone number
      if (!/^\+?[1-9]\d{1,14}$/.test(cleanPhone)) {
        setTestResult("❌ Número de telefone inválido");
        return;
      }

      // Create tel: link
      const telLink = `tel:${cleanPhone}`;

      // Try to open the dialer
      window.location.href = telLink;

      setTestResult("✅ Teste executado! Verifique se o marcador abriu.");

      // Clear result after 3 seconds
      setTimeout(() => {
        setTestResult(null);
      }, 3000);
    } catch (error) {
      setTestResult("❌ Erro no teste: " + error);
    }
  };

  const testMapsRedirect = () => {
    if (!enableMapsRedirect) {
      setTestResult("❌ Redirecionamento para Maps está desativado");
      return;
    }

    try {
      if (!testAddress.trim()) {
        setTestResult("❌ Endereço de teste vazio");
        return;
      }

      // Open Google Maps with the address
      const encodedAddress = encodeURIComponent(testAddress);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

      window.open(mapsUrl, "_blank");

      setTestResult(
        "✅ Teste executado! Verifique se o Google Maps abriu numa nova aba.",
      );

      // Clear result after 3 seconds
      setTimeout(() => {
        setTestResult(null);
      }, 3000);
    } catch (error) {
      setTestResult("❌ Erro no teste: " + error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center mb-4">
          <Phone className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Configurações de Telefone e Navegação
          </h3>
        </div>

        <div className="space-y-6">
          {/* Toggle Setting */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                📞
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">
                    Marcação Automática
                  </h4>
                  <button
                    onClick={() => togglePhoneDialer(!enablePhoneDialer)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      enablePhoneDialer ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enablePhoneDialer ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-blue-700 text-sm mb-3">
                  Quando ativado, clicar num número de telefone abrirá
                  diretamente o marcador do dispositivo.
                </p>
                <p className="text-blue-600 text-xs">
                  Estado: {enablePhoneDialer ? "✅ Ativo" : "⭕ Inativo"}
                </p>
              </div>
            </div>
          </div>

          {/* Google Maps Redirect Setting */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                🗺️
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-900">
                    Redirecionamento para Maps
                  </h4>
                  <button
                    onClick={() => toggleMapsRedirect(!enableMapsRedirect)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      enableMapsRedirect ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enableMapsRedirect ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-green-700 text-sm mb-3">
                  Quando ativado, clicar numa morada abrirá diretamente o Google
                  Maps numa nova aba.
                </p>
                <p className="text-green-600 text-xs">
                  Estado: {enableMapsRedirect ? "✅ Ativo" : "⭕ Inativo"}
                </p>
              </div>
            </div>
          </div>

          {/* Test Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Teste de Funcionalidade
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Teste
                </label>
                <input
                  type="tel"
                  value={testNumber}
                  onChange={(e) => setTestNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+351 912 345 678"
                />
              </div>

              <button
                onClick={testPhoneDialer}
                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                  enablePhoneDialer
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!enablePhoneDialer}
              >
                {enablePhoneDialer
                  ? "🧪 Testar Marcação"
                  : "❌ Ativar primeiro"}
              </button>

              {testResult && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    testResult.includes("✅")
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {testResult}
                </div>
              )}
            </div>

            <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-900">Teste Google Maps</h5>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço de Teste
                </label>
                <input
                  type="text"
                  value={testAddress}
                  onChange={(e) => setTestAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Quinta da Marinha, Cascais, Portugal"
                />
              </div>

              <button
                onClick={testMapsRedirect}
                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                  enableMapsRedirect
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!enableMapsRedirect}
              >
                {enableMapsRedirect
                  ? "🗺️ Testar Google Maps"
                  : "❌ Ativar primeiro"}
              </button>
            </div>
          </div>

          {/* Information Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">
              ℹ️ Informações Importantes
            </h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-yellow-900 mb-1">
                  📞 Marcação Automática:
                </h5>
                <ul className="text-yellow-800 text-sm space-y-1 ml-4">
                  <li>• Funciona em iPhone, Android e desktop</li>
                  <li>
                    • Usa o protocolo padrão tel: para máxima compatibilidade
                  </li>
                  <li>
                    • Limpa automaticamente números (remove espaços, traços)
                  </li>
                  <li>
                    • Em desktop, pode abrir aplicações como Skype ou Teams
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-yellow-900 mb-1">
                  🗺️ Google Maps:
                </h5>
                <ul className="text-yellow-800 text-sm space-y-1 ml-4">
                  <li>• Abre Google Maps numa nova aba/janela</li>
                  <li>• Funciona em qualquer navegador e dispositivo</li>
                  <li>• Codifica automaticamente caracteres especiais</li>
                  <li>
                    • Pode abrir apps nativas do Maps em dispositivos móveis
                  </li>
                </ul>
              </div>

              <p className="text-yellow-800 text-sm font-medium">
                🔄 Ambas as configurações são sincronizadas globalmente na
                aplicação
              </p>
            </div>
          </div>

          {/* Current Settings Display */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Estado Atual do Sistema
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">📞 Marcação Automática:</span>
                <span
                  className={`ml-2 font-medium ${
                    enablePhoneDialer ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {enablePhoneDialer ? "Ativada" : "Desativada"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">🗺️ Google Maps:</span>
                <span
                  className={`ml-2 font-medium ${
                    enableMapsRedirect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {enableMapsRedirect ? "Ativado" : "Desativado"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">💾 Armazenamento:</span>
                <span className="ml-2 font-medium text-blue-600">
                  Local Storage (sincronizado globalmente)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
