import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Card, Button } from "@heroui/react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  isLiked?: boolean;
  onToggleLike?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export function ProductCard({ id, name, price, image, isLiked = false, onToggleLike, onClick, className }: ProductCardProps) {
  return (
    <Card
      className={cn("p-0 bg-transparent border-none shadow-none group cursor-pointer", className)}
      onClick={() => onClick?.(id)}
    >
      <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
        <Image src={image} alt={name} width={500} height={500} className="w-full h-full object-cover" />
        {onToggleLike && (
          <Button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleLike(id); }}
            className={cn("absolute top-3 right-3 w-9 h-9 bg-transparent rounded-full flex items-center justify-center transition-all duration-200", !isLiked && "hover:scale-90")}
            aria-label={isLiked ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {isLiked ? <FaHeart className="w-5 h-5 text-black/60" /> : <FaRegHeart className="w-6 h-6 text-black" />}
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between px-4 -mt-2">
        <h3 className="text-black text-xs lg:text-sm">{name}</h3>
        <p className="text-black text-xs lg:text-sm">${price}</p>
      </div>
    </Card>
  );
}