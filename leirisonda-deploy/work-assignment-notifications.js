// WORK ASSIGNMENT NOTIFICATIONS - Sistema de notificações para atribuições de obra

console.log(
  "👥 ASSIGNMENT: Iniciando sistema de notificações de atribuição...",
);

(function () {
  "use strict";

  let users = [];
  let lastKnownAssignments = new Map();

  // Carregar utilizadores
  function loadUsers() {
    try {
      const usersData = localStorage.getItem("users");
      if (usersData) {
        users = JSON.parse(usersData);
        console.log("👥 ASSIGNMENT: Utilizadores carregados:", users.length);
      }
    } catch (e) {
      console.error("👥 ASSIGNMENT: Erro ao carregar utilizadores:", e);
    }
  }

  // Encontrar utilizador por ID
  function getUserById(userId) {
    return (
      users.find((user) => user.id === userId) || { id: userId, name: userId }
    );
  }

  // Detectar nova atribuição
  function detectNewAssignment(workData, userId) {
    const workId = workData.id || workData.workSheetNumber;
    const userAssignmentKey = `${workId}_${userId}`;

    if (!lastKnownAssignments.has(userAssignmentKey)) {
      lastKnownAssignments.set(userAssignmentKey, true);

      const user = getUserById(userId);
      const workNumber =
        workData.workSheetNumber || workData.folhaObra || workId;
      const clientName =
        workData.clientName || workData.client || "Cliente não especificado";

      console.log("🎯 ASSIGNMENT: Nova atribuição detectada!", {
        user: user.name,
        userId: userId,
        work: workNumber,
        client: clientName,
      });

      // Enviar notificação
      sendAssignmentNotification(user, workNumber, clientName, workData);

      // Guardar no localStorage para trigger
      const notificationData = {
        userId: userId,
        userName: user.name,
        workId: workId,
        workNumber: workNumber,
        clientName: clientName,
        timestamp: new Date().toISOString(),
        type: "work_assignment",
      };

      localStorage.setItem(
        "leirisonda_assignment_notification",
        JSON.stringify(notificationData),
      );

      return true;
    }

    return false;
  }

  // Enviar notificação de atribuição
  function sendAssignmentNotification(user, workNumber, clientName, workData) {
    if (window.NotificationManager && window.NotificationManager.isEnabled()) {
      window.NotificationManager.showLocal(`Nova Obra Atribuída`, {
        body: `A obra ${workNumber} (${clientName}) foi-lhe atribuída`,
        tag: `assignment-${workData.id || workNumber}`,
        icon: "/leirisonda-logo.svg",
        requireInteraction: true,
        data: {
          type: "work_assignment",
          workId: workData.id,
          workNumber: workNumber,
          clientName: clientName,
          userId: user.id,
        },
      });

      console.log("📱 ASSIGNMENT: Notificação enviada para", user.name);
    } else {
      console.log("📱 ASSIGNMENT: Notificações não disponíveis");
    }
  }

  // Interceptar localStorage setItem para detectar saves de obra
  function setupLocalStorageInterceptor() {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      try {
        // Detectar quando obra é salva
        if (
          key === "works" ||
          key === "leirisonda_works" ||
          key.includes("work")
        ) {
          const data = JSON.parse(value);

          if (Array.isArray(data)) {
            // Array de obras
            data.forEach((work) => {
              if (work.assignedUsers && work.assignedUsers.length > 0) {
                work.assignedUsers.forEach((userId) => {
                  detectNewAssignment(work, userId);
                });
              }
            });
          } else if (data && data.assignedUsers) {
            // Obra individual
            data.assignedUsers.forEach((userId) => {
              detectNewAssignment(data, userId);
            });
          }
        }

        // Detectar notificação de nova obra
        if (key === "leirisonda_new_work_notification") {
          const workData = JSON.parse(value);
          if (workData.assignedUsers && workData.assignedUsers.length > 0) {
            workData.assignedUsers.forEach((userId) => {
              detectNewAssignment(workData, userId);
            });
          }
        }
      } catch (e) {
        // Ignorar erros de parsing
      }

      return originalSetItem.call(this, key, value);
    };

    console.log("👥 ASSIGNMENT: Interceptor localStorage ativo");
  }

  // Interceptar operações de atribuição no DOM
  function setupDOMInterceptor() {
    // Monitor para cliques em botões de atribuição
    document.addEventListener(
      "click",
      (e) => {
        const target = e.target;
        if (target && target.tagName === "BUTTON") {
          const text = target.textContent?.toLowerCase() || "";

          if (text.includes("atribuir") || text.includes("assign")) {
            console.log("👥 ASSIGNMENT: Botão de atribuição clicado");

            // Aguardar um pouco e verificar mudanças
            setTimeout(() => {
              checkForNewAssignments();
            }, 2000);
          }
        }
      },
      true,
    );

    // Monitor para mudanças em selects de utilizadores
    document.addEventListener(
      "change",
      (e) => {
        const target = e.target;
        if (target && target.tagName === "SELECT") {
          const container = target.closest("div");
          if (
            container &&
            container.textContent.toLowerCase().includes("utilizador")
          ) {
            console.log("👥 ASSIGNMENT: Select de utilizador alterado");

            setTimeout(() => {
              checkForNewAssignments();
            }, 1000);
          }
        }
      },
      true,
    );

    console.log("👥 ASSIGNMENT: Interceptor DOM ativo");
  }

  // Verificar novas atribuições nos dados atuais
  function checkForNewAssignments() {
    try {
      const works = JSON.parse(localStorage.getItem("works") || "[]");
      const leirisondaWorks = JSON.parse(
        localStorage.getItem("leirisonda_works") || "[]",
      );

      [...works, ...leirisondaWorks].forEach((work) => {
        if (work.assignedUsers && work.assignedUsers.length > 0) {
          work.assignedUsers.forEach((userId) => {
            detectNewAssignment(work, userId);
          });
        }
      });
    } catch (e) {
      console.error("👥 ASSIGNMENT: Erro ao verificar atribuições:", e);
    }
  }

  // Monitor contínuo para mudanças nas obras
  function setupContinuousMonitoring() {
    let lastWorksString = "";

    const monitor = setInterval(() => {
      try {
        const works = localStorage.getItem("works") || "[]";
        const leirisondaWorks =
          localStorage.getItem("leirisonda_works") || "[]";
        const currentString = works + leirisondaWorks;

        if (currentString !== lastWorksString) {
          console.log("👥 ASSIGNMENT: Mudança nas obras detectada");
          lastWorksString = currentString;
          checkForNewAssignments();
        }
      } catch (e) {
        // Ignorar erros
      }
    }, 5000);

    // Parar monitor após 10 minutos
    setTimeout(() => {
      clearInterval(monitor);
    }, 600000);

    console.log("👥 ASSIGNMENT: Monitor contínuo ativo");
  }

  // Inicializar sistema
  function init() {
    loadUsers();
    setupLocalStorageInterceptor();
    setupDOMInterceptor();
    setupContinuousMonitoring();

    // Verificar atribuições existentes
    checkForNewAssignments();

    console.log("👥 ASSIGNMENT: Sistema de notificações de atribuição ativo");
  }

  // Aguardar sistema de notificações estar pronto
  function waitForNotificationSystem() {
    if (window.NotificationManager) {
      init();
    } else {
      setTimeout(waitForNotificationSystem, 1000);
    }
  }

  // Inicializar quando DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForNotificationSystem);
  } else {
    waitForNotificationSystem();
  }
})();
