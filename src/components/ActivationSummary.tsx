import React from "react";
import {
  CheckCircle,
  Smartphone,
  Bell,
  MapPin,
  Camera,
  Database,
  Wifi,
  Users,
  Globe,
  Shield,
  Zap,
} from "lucide-react";

export const ActivationSummary: React.FC = () => {
  const features = [
    {
      icon: Bell,
      title: "Notificações Push",
      description:
        "Receba alertas em tempo real sobre obras, manutenções e tarefas",
      technical: "Notification API + Service Worker",
    },
    {
      icon: MapPin,
      title: "Localização GPS",
      description: "Navegação automática para locais de trabalho e clientes",
      technical: "Geolocation API + Google Maps integration",
    },
    {
      icon: Camera,
      title: "Câmera Integrada",
      description: "Tire fotografias diretamente nas obras e relatórios",
      technical: "MediaDevices getUserMedia API",
    },
    {
      icon: Database,
      title: "Armazenamento Offline",
      description: "Trabalhe sem internet, dados sincronizam automaticamente",
      technical: "LocalStorage + IndexedDB + Cache API",
    },
    {
      icon: Wifi,
      title: "Sincronização Firebase",
      description:
        "Dados em nuvem sincronizados em tempo real entre dispositivos",
      technical: "Firebase Firestore + Realtime Database",
    },
    {
      icon: Users,
      title: "Multi-Utilizador",
      description:
        "Vários utilizadores podem aceder e trabalhar simultaneamente",
      technical: "Firebase Auth + Role-based permissions",
    },
    {
      icon: Globe,
      title: "Instalação PWA",
      description: "Instale como app nativa no telemóvel ou computador",
      technical: "Progressive Web App + Service Worker",
    },
    {
      icon: Shield,
      title: "Segurança Avançada",
      description: "Autenticação segura e proteção de dados",
      technical: "JWT tokens + Encrypted storage",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <Zap className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">
          Funcionalidades Ativadas com um Clique
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;

          return (
            <div
              key={index}
              className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-3 flex-shrink-0">
                  <IconComponent className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {feature.description}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {feature.technical}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-medium text-green-900 mb-1">
              Ativação Automática Inteligente
            </h4>
            <p className="text-sm text-green-800 mb-2">
              O sistema detecta automaticamente as capacidades do dispositivo e
              ativa apenas as funcionalidades suportadas. Mesmo que algumas
              falhem, as outras continuam a funcionar normalmente.
            </p>
            <ul className="text-xs text-green-700 space-y-1">
              <li>
                • <strong>Progressivo:</strong> Ativa uma funcionalidade de cada
                vez
              </li>
              <li>
                • <strong>Resiliente:</strong> Falhas numa funcionalidade não
                afetam as outras
              </li>
              <li>
                • <strong>Compatível:</strong> Adapta-se a diferentes browsers e
                dispositivos
              </li>
              <li>
                • <strong>Informativo:</strong> Mostra progresso em tempo real
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationSummary;
