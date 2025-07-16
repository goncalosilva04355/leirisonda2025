import React, { useState, useEffect } from "react";
import {
  Users,
  Cloud,
  Smartphone,
  Upload,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Shield,
} from "lucide-react";
import { hybridAuthService as authService } from "../services/hybridAuthService";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

interface LocalUser {
  uid: string;
  email: string;
  name: string;
  role: "super_admin" | "manager" | "technician";
  active: boolean;
  createdAt: string;
}

export const CrossDeviceUserManager: React.FC = () => {
  const [localUsers, setLocalUsers] = useState<LocalUser[]>([]);
  const [migrationStatus, setMigrationStatus] = useState<{
    [key: string]: "pending" | "success" | "error" | "migrating";
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocalUsers();
  }, []);

  const loadLocalUsers = () => {
    try {
      const mockUsers = localStorage.getItem("mock-users");
      if (mockUsers) {
        const users = JSON.parse(mockUsers);
        const userList = Object.values(users) as LocalUser[];
        setLocalUsers(userList);
      }
    } catch (error) {
      console.error("Error loading local users:", error);
    } finally {
      setLoading(false);
    }
  };

  const migrateUserToFirebase = async (user: LocalUser, password: string) => {
    if (!auth || !db) {
      setMigrationStatus((prev) => ({ ...prev, [user.uid]: "error" }));
      return;
    }

    setMigrationStatus((prev) => ({ ...prev, [user.uid]: "migrating" }));

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        password,
      );
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName: user.name });

      // Get default permissions based on role
      const getDefaultPermissions = (role: string) => {
        switch (role) {
          case "super_admin":
            return {
              obras: { view: true, create: true, edit: true, delete: true },
              manutencoes: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              piscinas: { view: true, create: true, edit: true, delete: true },
              utilizadores: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              relatorios: {
                view: true,
                create: true,
                edit: true,
                delete: true,
              },
              clientes: { view: true, create: true, edit: true, delete: true },
            };
          case "manager":
            return {
              obras: { view: true, create: true, edit: true, delete: true },
              manutencoes: {
                view: true,
                create: true,
                edit: true,
                delete: false,
              },
              piscinas: { view: true, create: true, edit: true, delete: false },
              utilizadores: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              relatorios: {
                view: true,
                create: true,
                edit: false,
                delete: false,
              },
              clientes: { view: true, create: true, edit: true, delete: false },
            };
          default: // technician
            return {
              obras: { view: true, create: true, edit: true, delete: false },
              manutencoes: {
                view: true,
                create: true,
                edit: true,
                delete: false,
              },
              piscinas: {
                view: true,
                create: true,
                edit: true,
                delete: false,
              },
              utilizadores: {
                view: false,
                create: false,
                edit: false,
                delete: false,
              },
              relatorios: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
              clientes: {
                view: true,
                create: false,
                edit: false,
                delete: false,
              },
            };
        }
      };

      // Create user profile in Firestore
      const userProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name: user.name,
        role: user.role,
        permissions: getDefaultPermissions(user.role),
        active: user.active,
        createdAt: user.createdAt,
        migratedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", firebaseUser.uid), userProfile);

      setMigrationStatus((prev) => ({ ...prev, [user.uid]: "success" }));
      console.log(`✅ User ${user.email} migrated to Firebase successfully`);
    } catch (error: any) {
      console.error("Migration error:", error);
      setMigrationStatus((prev) => ({ ...prev, [user.uid]: "error" }));
    }
  };

  const MigrationForm: React.FC<{
    user: LocalUser;
    onMigrate: (password: string) => void;
  }> = ({ user, onMigrate }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (password.length < 6) {
        setError("Password deve ter pelo menos 6 caracteres");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords não coincidem");
        return;
      }

      onMigrate(password);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nova Password para Firebase
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Repita a password"
            required
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Migrar para Firebase
        </button>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">A carregar utilizadores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Cloud className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Acesso Multi-Dispositivo
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Utilizadores criados no Firebase podem aceder de qualquer
              dispositivo. Utilizadores locais apenas acedem do dispositivo onde
              foram criados.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Gestão de Utilizadores
          </h3>
        </div>

        <div className="p-6">
          {localUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Nenhum utilizador local encontrado
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {localUsers.map((user) => {
                const status = migrationStatus[user.uid];

                return (
                  <div
                    key={user.uid}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Smartphone className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="text-sm text-orange-600">Local</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {user.name}
                          </h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">
                            {user.role === "super_admin"
                              ? "Super Admin"
                              : user.role === "manager"
                                ? "Gestor"
                                : "Técnico"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {status === "success" && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Migrado</span>
                          </div>
                        )}
                        {status === "error" && (
                          <div className="flex items-center text-red-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Erro</span>
                          </div>
                        )}
                        {status === "migrating" && (
                          <div className="flex items-center text-blue-600">
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            <span className="text-sm">Migrando...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {status !== "success" && status !== "migrating" && (
                      <MigrationForm
                        user={user}
                        onMigrate={(password) =>
                          migrateUserToFirebase(user, password)
                        }
                      />
                    )}

                    {status === "success" && (
                      <div className="border-t pt-4">
                        <div className="flex items-center text-green-700 bg-green-50 p-3 rounded-md">
                          <Cloud className="h-4 w-4 mr-2" />
                          <span className="text-sm">
                            Utilizador migrado com sucesso! Agora pode aceder de
                            qualquer dispositivo.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-gray-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-gray-800 mb-2">
              Como garantir acesso multi-dispositivo:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • Novos utilizadores são automaticamente criados no Firebase
              </li>
              <li>
                • Utilizadores existentes locais podem ser migrados usando este
                painel
              </li>
              <li>
                • Após migração, utilizadores podem fazer login de qualquer
                dispositivo
              </li>
              <li>• A password será a mesma definida durante a migração</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
