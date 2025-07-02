// EMERGENCY FIX - PASTE THIS IN CONSOLE IF PROBLEM PERSISTS
console.log("🚨 EMERGENCY FIX ACTIVATED");

// NUCLEAR OPTION - BLOCK EVERYTHING
window.EMERGENCY_MODE = true;

// Block ALL navigation attempts
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function () {
  console.warn("🚫 EMERGENCY: Blocked history.pushState");
  return;
};

history.replaceState = function () {
  console.warn("🚫 EMERGENCY: Blocked history.replaceState");
  return;
};

// Block location changes
Object.defineProperty(location, "href", {
  set: function () {
    console.warn("🚫 EMERGENCY: Blocked location.href change");
  },
});

// Block window reload
window.location.reload = function () {
  console.warn("🚫 EMERGENCY: Blocked page reload");
};

// Override all Firebase auth methods
if (window.firebase?.auth) {
  const auth = window.firebase.auth();
  if (auth.signOut) {
    auth.signOut = () => {
      console.warn("🚫 EMERGENCY: Blocked Firebase signOut");
      return Promise.resolve();
    };
  }
}

// Block React Router
if (window.React) {
  const originalCreateElement = window.React.createElement;
  window.React.createElement = function (type, props) {
    if (typeof type === "string" && type.toLowerCase().includes("redirect")) {
      console.warn("🚫 EMERGENCY: Blocked React Redirect");
      return null;
    }
    return originalCreateElement.apply(this, arguments);
  };
}

// Show success message
document.body.style.position = "relative";
const emergencyNotice = document.createElement("div");
emergencyNotice.innerHTML = `
  <div style="
    position: fixed;
    top: 20px;
    right: 20px;
    background: #dc2626;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-family: system-ui;
    font-weight: bold;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  ">
    🚨 EMERGENCY MODE ACTIVE<br>
    All navigation blocked!
  </div>
`;
document.body.appendChild(emergencyNotice);

console.log("🛡️ EMERGENCY MODE: All navigation and auth functions blocked!");
console.log("🔧 Try creating obra now - logout should be impossible");
