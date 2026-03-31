import { cn } from "@/lib/utils";
import { Card } from "@heroui/react";

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <Card
      className={cn(
        "p-0 bg-transparent border-none shadow-none",
        className
      )}
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-200 animate-pulse">
        <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-300 animate-pulse" />
      </div>

      {/* Name + price row — matches px-4 -mt-2 layout */}
      <div className="flex items-center justify-between px-4 -mt-2">
        <div className="h-3 lg:h-3.5 w-24 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-3 lg:h-3.5 w-10 rounded-full bg-gray-200 animate-pulse" />
      </div>
    </Card>
  );
}