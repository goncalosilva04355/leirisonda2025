import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

export const LoadingSpinner = React.memo<LoadingSpinnerProps>(
  ({ size = "md", className, message = "A carregar..." }) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
    };

    const messageSizes = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3",
          className,
        )}
      >
        <div
          className={cn(
            "border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin",
            sizeClasses[size],
          )}
          style={{
            animation: "spin 1s linear infinite",
            willChange: "transform",
          }}
        />
        {message && (
          <p className={cn("text-gray-600 font-medium", messageSizes[size])}>
            {message}
          </p>
        )}
      </div>
    );
  },
);

LoadingSpinner.displayName = "LoadingSpinner";
