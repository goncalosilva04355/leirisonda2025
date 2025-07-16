import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function SimpleApp() {
  return (
    <div>
      <h1>Leirisonda funciona!</h1>
      <p>Se conseguir ver isto, o problema foi resolvido.</p>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <SimpleApp />
  </StrictMode>,
);
