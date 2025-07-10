import { useEffect, useRef } from "react";
import StabilityMonitor from "../utils/stabilityMonitor";

// Hook useEffect seguro que previne loops infinitos
export const useSafeEffect = (
  callback: () => void | (() => void),
  deps: any[],
  name: string = "unknown",
) => {
  const callCountRef = useRef(0);
  const lastCallRef = useRef(0);
  const MAX_CALLS_PER_SECOND = 10;

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;

    // Reset counter se passou mais de 1 segundo
    if (timeSinceLastCall > 1000) {
      callCountRef.current = 0;
    }

    callCountRef.current++;
    lastCallRef.current = now;

    // Verificar se está a ser chamado muito frequentemente
    if (callCountRef.current > MAX_CALLS_PER_SECOND) {
      console.warn(
        `⚠️ useSafeEffect(${name}): Too many calls, skipping to prevent loop`,
      );
      return;
    }

    try {
      return StabilityMonitor.createSafeEffect(callback, deps, name)();
    } catch (error: any) {
      StabilityMonitor.recordError(error, `useSafeEffect:${name}`);
    }
  }, deps);
};

// Hook para logs throttled (evita spam de logs)
export const useThrottledLog = (
  message: string,
  data: any,
  deps: any[],
  interval: number = 5000,
) => {
  const lastLogRef = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastLogRef.current > interval) {
      console.log(message, data);
      lastLogRef.current = now;
    }
  }, deps);
};

// Hook para detectar re-renders excessivos
export const useRenderCounter = (componentName: string) => {
  const renderCountRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  renderCountRef.current++;

  useEffect(() => {
    const renderCount = renderCountRef.current;
    const elapsed = Date.now() - startTimeRef.current;

    if (renderCount > 50 && elapsed < 5000) {
      console.warn(
        `⚠️ ${componentName}: High render count (${renderCount} in ${elapsed}ms)`,
      );
      StabilityMonitor.recordError(
        new Error(`High render count: ${renderCount} renders in ${elapsed}ms`),
        `RenderCounter:${componentName}`,
      );
    }
  });

  return renderCountRef.current;
};

export default useSafeEffect;
