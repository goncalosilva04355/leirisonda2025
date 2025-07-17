import React from "react";
import { RefreshCw } from "lucide-react";

interface RefreshIndicatorProps {
  isVisible: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  canRefresh: boolean;
  threshold: number;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({
  isVisible,
  isRefreshing,
  pullDistance,
  canRefresh,
  threshold,
}) => {
  if (!isVisible) return null;

  const getRefreshText = () => {
    if (isRefreshing) return "A atualizar dados...";
    if (canRefresh) return "Solte para atualizar";
    return "Puxe para atualizar";
  };

  const getOpacity = () => {
    return Math.min(pullDistance / threshold, 1);
  };

  const getIconRotation = () => {
    if (isRefreshing) return "animate-spin";
    if (canRefresh) return "rotate-180";
    return "";
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white border-b border-blue-200 transition-all duration-300"
      style={{
        height: `${Math.max(pullDistance, isRefreshing ? threshold : 0)}px`,
        opacity: getOpacity(),
        transform: `translateY(${isVisible ? 0 : -100}%)`,
      }}
    >
      <div className="flex items-center space-x-2 text-blue-600">
        <RefreshCw
          className={`h-5 w-5 transition-transform duration-300 ${getIconRotation()}`}
        />
        <span className="text-sm font-medium">{getRefreshText()}</span>
      </div>

      {/* Progress indicator */}
      <div className="mt-2 w-12 h-1 bg-blue-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-200"
          style={{
            width: `${Math.min((pullDistance / threshold) * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
};

export default RefreshIndicator;
