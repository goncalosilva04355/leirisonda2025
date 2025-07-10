import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";

interface InstallPromptProps {
  onClose?: () => void;
}

export const InstallPromptFixed: React.FC<InstallPromptProps> = ({
  onClose,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    try {
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

      // Listen for the beforeinstallprompt event
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt,
        );
      };
    } catch (error) {
      console.error("Error in InstallPrompt useEffect:", error);
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === "accepted") {
          console.log("User accepted the install prompt");
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      } catch (error) {
        console.error("Error during install:", error);
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("install-prompt-dismissed", "true");
    setShowPrompt(false);
    if (onClose) onClose();
  };

  // Don't render if shouldn't show or if already installed
  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">
                Instalar Aplicação
              </h3>
              <p className="text-sm text-gray-500">
                Adicione à tela inicial para acesso rápido
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {isIOS ? (
            <div className="text-sm text-gray-600">
              <div className="flex items-center">
                <Share className="h-4 w-4 mr-1" />
                <span>
                  Toque em "Partilhar" e depois "Adicionar ao Ecrã Principal"
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Instalar
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
};
