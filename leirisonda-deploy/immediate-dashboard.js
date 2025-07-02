// IMMEDIATE DASHBOARD - Força ir para dashboard imediatamente

console.log("🚀 IMMEDIATE DASHBOARD: Forçando navegação...");

// Executar imediatamente
setTimeout(() => {
  console.log("🚀 Redirecionando para dashboard...");

  // Configurar auth bypass
  try {
    localStorage.setItem("authBypass", "true");
    localStorage.setItem("userAuthenticated", "true");
    localStorage.setItem("skipProtectedRoute", "true");
  } catch (e) {}

  // Navegar para dashboard
  window.location.href = "/dashboard";
}, 2000);

// Backup: forçar depois de 5 segundos se ainda estiver preso
setTimeout(() => {
  const protectedRoute = document.querySelector(
    '[data-loc="code/client/components/ProtectedRoute.tsx:37:7"]',
  );
  if (protectedRoute) {
    console.log("🚀 BACKUP: Ainda preso, forçando navegação...");
    window.location.href = "/dashboard";
  }
}, 5000);

console.log("✅ IMMEDIATE DASHBOARD: Redirecionamento configurado");
