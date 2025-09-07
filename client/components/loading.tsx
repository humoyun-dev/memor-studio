import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loader({
  className,
  size = "md",
}: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-36 h-36",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 border-2 border-muted rounded-full" />
      <div
        className="absolute inset-2 border-t-2 border-primary rounded-full animate-spin"
        style={{ animationDuration: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
