import React, { useEffect, useRef } from "react";

interface RenderTrackerProps {
  name: string;
  data?: any;
}

export const RenderTracker: React.FC<RenderTrackerProps> = ({ name, data }) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  renderCount.current += 1;
  const currentTime = Date.now();
  const timeSinceLastRender = currentTime - lastRenderTime.current;
  lastRenderTime.current = currentTime;

  useEffect(() => {
    if (renderCount.current > 5) {
      console.warn(`🚨 ${name} rendered ${renderCount.current} times!`);
    }

    if (timeSinceLastRender < 10) {
      console.warn(
        `🚨 ${name} rapid re-render! Time since last: ${timeSinceLastRender}ms`,
      );
    }

    console.log(
      `🔄 ${name} render #${renderCount.current} (${timeSinceLastRender}ms since last)`,
      data
        ? { dataLength: Array.isArray(data) ? data.length : "not array" }
        : "",
    );
  });

  return null; // This component doesn't render anything
};

export default RenderTracker;
