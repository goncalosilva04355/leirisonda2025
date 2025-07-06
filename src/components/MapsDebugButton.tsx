import React, { useState } from "react";
import { MapPin } from "lucide-react";

export const MapsDebugButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [testResult, setTestResult] = useState<string>("");

  const testMapsRedirect = () => {
    const enableMapsRedirect =
      localStorage.getItem("enableMapsRedirect") === "true";
    const testAddress = "Quinta da Marinha, Cascais, Portugal";

    console.log("🧪 MAPS DEBUG TEST:");
    console.log("- Maps redirect enabled:", enableMapsRedirect);
    console.log("- Test address:", testAddress);

    if (!enableMapsRedirect) {
      setTestResult("❌ Google Maps está desativado. Ative nas configurações.");
      return;
    }

    try {
      const encodedAddress = encodeURIComponent(testAddress);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

      console.log("- Maps URL:", mapsUrl);

      // Try to open Google Maps
      const newWindow = window.open(mapsUrl, "_blank");

      if (newWindow) {
        setTestResult("✅ Google Maps aberto com sucesso!");
        console.log("✅ Google Maps opened successfully");
      } else {
        setTestResult(
          "❌ Bloqueador de pop-ups pode estar ativo. Verifique as configurações do navegador.",
        );
        console.warn("⚠️ Pop-up may be blocked");
      }
    } catch (error) {
      setTestResult(`❌ Erro: ${error}`);
      console.error("❌ Error:", error);
    }

    // Clear result after 5 seconds
    setTimeout(() => {
      setTestResult("");
    }, 5000);
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-colors z-40"
        title="Testar Google Maps"
      >
        <MapPin className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-72 z-40">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">🗺️ Debug Google Maps</h4>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-sm">
          <div className="flex justify-between">
            <span>Status:</span>
            <span
              className={
                localStorage.getItem("enableMapsRedirect") === "true"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {localStorage.getItem("enableMapsRedirect") === "true"
                ? "✅ Ativo"
                : "❌ Inativo"}
            </span>
          </div>
        </div>

        <button
          onClick={testMapsRedirect}
          className="w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          🧪 Testar Google Maps
        </button>

        <button
          onClick={() => {
            localStorage.setItem("enableMapsRedirect", "true");
            setTestResult("✅ Google Maps ativado!");
            setTimeout(() => setTestResult(""), 3000);

            // Trigger sync event
            window.dispatchEvent(
              new CustomEvent("mapsRedirectToggled", {
                detail: { enabled: true },
              }),
            );
          }}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          🔧 Forçar Ativação
        </button>

        {testResult && (
          <div
            className={`p-2 rounded text-sm ${
              testResult.includes("✅")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
};
