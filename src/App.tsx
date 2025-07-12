// BACKUP CRIADO EM: 2024-12-30
// VERSÃO ESTÁVEL COM:
// - Login funcional com "Lembrar-me"
// - Auto-login opcional
// - Dashboard com obras funcionais
// - Formulário de criação de obras
// - Click nas obras atribuídas
// - Modal de detalhes das obras
// - Sem erros React hooks

import React, { useState, useEffect } from "react";
import {
  Building2,
  Menu,
  X,
  Home,
  Plus,
  Wrench,
  Waves,
  BarChart3,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Save,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
  Bell,
} from "lucide-react";
import jsPDF from "jspdf";
import { FirebaseConfig } from "./components/FirebaseConfig";
import { AdvancedSettings } from "./components/AdvancedSettings";
import { SyncStatusDisplay } from "./components/SyncStatusDisplay";
// import { InstallPrompt } from "./components/InstallPrompt"; // Temporarily disabled due to React hook error
import { UserPermissionsManager } from "./components/UserPermissionsManager";
import { RegisterForm } from "./components/RegisterForm";

// import { AutoSyncProvider } from "./components/AutoSyncProvider"; // Temporarily disabled due to React hook error
// import { SyncStatusIcon } from "./components/SyncStatusIndicator"; // Temporarily disabled due to AutoSyncProvider dependency
import { FirebaseQuotaWarning } from "./components/FirebaseQuotaWarning";

// SECURITY: RegisterForm removed - only super admin can create users
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { useDataSync } from "./hooks/useDataSync_simple";
import {
  hybridAuthService as authService,
  UserProfile,
} from "./services/hybridAuthService";
import { useDataCleanup } from "./hooks/useDataCleanup";
// import { useAutoSync } from "./hooks/useAutoSync"; // Temporarily disabled due to React hook error

// BACKUP - ESTE ARQUIVO CONTÉM UMA VERSÃO FUNCIONAL
// Para restaurar, copie o conteúdo deste arquivo para src/App.tsx
