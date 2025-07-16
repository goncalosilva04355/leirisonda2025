import React, { useState, useRef, useEffect, ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 60,
  disabled = false,
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canRefresh, setCanRefresh] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isActive = useRef<boolean>(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled || isRefreshing) return;

    const touch = e.touches[0];
    startY.current = touch.clientY;
    currentY.current = touch.clientY;

    // Só ativar se estiver no topo da página
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop === 0) {
      isActive.current = true;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isActive.current || disabled || isRefreshing) return;

    const touch = e.touches[0];
    currentY.current = touch.clientY;

    const deltaY = currentY.current - startY.current;

    if (deltaY > 0) {
      setIsPulling(true);
      const distance = Math.min(deltaY * 0.5, threshold * 1.5);
      setPullDistance(distance);
      setCanRefresh(distance >= threshold);

      // Prevenir scroll durante o pull
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (!isActive.current || disabled) return;

    isActive.current = false;

    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(threshold);

      try {
        await onRefresh();
      } catch (error) {
        console.error("❌ Erro durante refresh:", error);
      }

      // Delay para mostrar animação de sucesso
      setTimeout(() => {
        setIsRefreshing(false);
        setIsPulling(false);
        setPullDistance(0);
        setCanRefresh(false);
      }, 500);
    } else {
      // Animar de volta para posição inicial
      const step = pullDistance / 10;
      const animate = () => {
        setPullDistance((prev) => {
          const newDistance = Math.max(0, prev - step);
          if (newDistance > 0) {
            requestAnimationFrame(animate);
          } else {
            setIsPulling(false);
            setCanRefresh(false);
          }
          return newDistance;
        });
      };
      animate();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [disabled, isRefreshing, threshold]);

  const getRefreshText = () => {
    if (isRefreshing) return "A atualizar...";
    if (canRefresh) return "Solte para atualizar";
    if (isPulling) return "Puxe para atualizar";
    return "";
  };

  const getRefreshOpacity = () => {
    if (isRefreshing) return 1;
    return Math.min(pullDistance / threshold, 1);
  };

  const getIconRotation = () => {
    if (isRefreshing) return "animate-spin";
    if (canRefresh) return "rotate-180";
    return "";
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Pull Indicator */}
      {(isPulling || isRefreshing) && (
        <div
          className="absolute top-0 left-0 right-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white border-b border-blue-200 transition-all duration-300"
          style={{
            height: `${Math.max(pullDistance, isRefreshing ? threshold : 0)}px`,
            opacity: getRefreshOpacity(),
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
      )}

      {/* Content */}
      <div
        className="transition-transform duration-300"
        style={{
          transform: `translateY(${isPulling || isRefreshing ? pullDistance : 0}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
