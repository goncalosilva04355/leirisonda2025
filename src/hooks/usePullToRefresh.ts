import { useEffect, useRef, useState } from "react";

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  disabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 60,
  disabled = false,
}: UsePullToRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);

  const startY = useRef<number>(0);
  const isActive = useRef<boolean>(false);
  const onRefreshRef = useRef(onRefresh);

  // Update ref when onRefresh changes
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    if (disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshing) return;

      const touch = e.touches[0];
      startY.current = touch.clientY;

      // Só ativar se estiver no topo da página
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop === 0) {
        isActive.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isActive.current || isRefreshing) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - startY.current;

      if (deltaY > 0) {
        setShowIndicator(true);
        const distance = Math.min(deltaY * 0.5, threshold * 1.5);
        setPullDistance(distance);

        // Prevenir scroll durante o pull
        if (deltaY > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (!isActive.current) return;

      isActive.current = false;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);

        try {
          await onRefreshRef.current();
        } catch (error) {
          console.error("❌ Erro durante refresh:", error);
        }

        // Delay para mostrar feedback
        setTimeout(() => {
          setIsRefreshing(false);
          setShowIndicator(false);
          setPullDistance(0);
        }, 500);
      } else {
        // Animar de volta
        setShowIndicator(false);
        setPullDistance(0);
      }
    };

    // Adicionar event listeners
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [threshold, disabled]);

  return {
    isRefreshing,
    pullDistance,
    showIndicator,
    canRefresh: pullDistance >= threshold,
  };
};
