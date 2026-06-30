import React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className = "", src, alt, fallback, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
    };

    return (
      <div
        ref={ref}
        className={`rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold shrink-0 ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt || ""} className="w-full h-full rounded-full object-cover" />
        ) : (
          fallback || "?"
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";