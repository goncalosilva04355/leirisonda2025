import React, { useState } from "react";
import { Phone, Map } from "lucide-react";

export const PhoneSettings: React.FC = () => {
  const [enablePhoneDialer, setEnablePhoneDialer] = useState(false);
  const [enableMapsRedirect, setEnableMapsRedirect] = useState(false);

  const handlePhoneDialerToggle = (enabled: boolean) => {
    setEnablePhoneDialer(enabled);

    // Dispatch custom event for other components
    window.dispatchEvent(
      new CustomEvent("phoneDialerToggled", { detail: { enabled } }),
    );
  };

  const handleMapsRedirectToggle = (enabled: boolean) => {
    setEnableMapsRedirect(enabled);

    // Dispatch custom event for other components
    window.dispatchEvent(
      new CustomEvent("mapsRedirectToggled", { detail: { enabled } }),
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        Configurações de Contacto
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Marcador Telefónico</p>
              <p className="text-sm text-gray-500">
                Converter números de telefone em links clicáveis
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enablePhoneDialer}
              onChange={(e) => handlePhoneDialerToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <Map className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">
                Redirecionamento para Mapas
              </p>
              <p className="text-sm text-gray-500">
                Converter endereços em links para Google Maps
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableMapsRedirect}
              onChange={(e) => handleMapsRedirectToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Nota:</strong> Estas configurações são temporárias e
          aplicam-se apenas a esta sessão.
        </p>
      </div>
    </div>
  );
};
