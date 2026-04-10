import { Button } from "@heroui/react";
import { RiHeart3Fill, RiHeart3Line } from "react-icons/ri";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";

export default function FavoriteButton({
  productId,
  profileId,
  initialLiked,
}: {
  productId: string;
  profileId?: string;
  initialLiked: boolean;
}) {
  const { isFav, toggle, loading } = useToggleFavorite(
    productId,
    profileId ?? "",
    initialLiked
  );

  if (!profileId) return null;

  return (
    <Button
      onClick={() => void toggle()}
      isDisabled={loading}
      aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`
        absolute top-3 right-3 w-9 h-9 bg-transparent rounded-full flex items-center justify-center transition-all duration-200
        ${isFav ? "text-rose-500" : "text-black"}
        ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110 active:scale-95"}
      `}
      
    >
      {isFav ? (
        <RiHeart3Fill className="w-6 h-6" style={{ stroke: "black", strokeWidth: 2.5}} />
      ) : (
        <RiHeart3Line className="w-6 h-6" />
      )}
    </Button>
  );
}