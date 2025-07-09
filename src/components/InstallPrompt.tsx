import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";

interface InstallPromptProps {
  onClose?: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if it's already installed (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;
    setIsStandalone(standalone);

    // Check if we should show the prompt
    const installPromptDismissed = localStorage.getItem(
      "install-prompt-dismissed",
    );
    const shouldShow = !standalone && !installPromptDismissed;
    setShowPrompt(shouldShow);

    // Listen for the beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android installation
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        console.log("PWA installation accepted");
      }
      setDeferredPrompt(null);
    }
    handleClose();
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem("install-prompt-dismissed", "true");
    onClose?.();
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mx-auto max-w-sm">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2Fcc309d103d0b4ade88d90ee94cb2f741%2Fcfe4c99ad2e74d27bb8b01476051f923?format=webp&width=48"
            alt="Leirisonda"
            className="w-8 h-8"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">
            Instalar Leirisonda
          </h3>
          <p className="text-gray-600 text-xs mt-1">
            {isIOS
              ? 'Toque em "Partilhar" e depois "Adicionar ao Ecrã Principal"'
              : "Instale a app para acesso rápido e notificações"}
          </p>

          {isIOS ? (
            <div className="flex items-center space-x-2 mt-2 text-blue-600">
              <Share className="w-4 h-4" />
              <span className="text-xs">
                Partilhar → Adicionar ao Ecrã Principal
              </span>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="mt-2 bg-cyan-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-cyan-700 transition-colors flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>Instalar App</span>
            </button>
          )}
        </div>

        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isIOS && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <Smartphone className="w-3 h-3 mr-1" />
            <span>Funciona melhor como app instalada</span>
          </div>
        </div>
      )}
    </div>
  );
};
