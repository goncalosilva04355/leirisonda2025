// Emergency script to force quota protection
import { syncManager } from "./syncManager";

// Force mark quota as exceeded
localStorage.setItem("firebase-quota-exceeded", "true");
localStorage.setItem("firebase-quota-check-time", new Date().toISOString());

// Force circuit breaker
syncManager.markQuotaExceeded();

console.error("🚨 EMERGENCY: Firebase quota protection activated manually");
console.error("🚨 All Firebase operations have been disabled");
console.error("🚨 Please wait 24 hours or contact administrator");

// Notify user
setTimeout(() => {
  alert(
    "⚠️ FIREBASE QUOTA EXCEDIDA: Sistema pausado automaticamente para prevenir bloqueio permanente. A aplicação continua a funcionar normalmente.",
  );
}, 1000);

export const forceQuotaProtection = () => {
  syncManager.markQuotaExceeded();
};
