"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ProductCard } from "@/components/home/productCard";
import { ProductCardSkeleton } from "@/components/home/productSkeletonCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useProfile } from "@/hooks/useProfile";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import type { ProductFull } from "@/hooks/useProduct";

function FavoriteItem({
  product,
  profileId,
  onRemoved,
  onOpen,
}: {
  product: ProductFull;
  profileId: string;
  onRemoved: (productId: string) => void;
  onOpen: (productId: string) => void;
}) {
  const { isFav, toggle, loading } = useToggleFavorite(product.id, profileId, true);

  const handleToggle = async () => {
    await toggle();
    if (isFav) {
      onRemoved(product.id);
    }
  };

  return (
    <ProductCard
      id={product.id}
      name={product.title}
      price={product.price ?? 0}
      image={product.product_images[0]?.url ?? "/placeholder-image.jpg"}
      isLiked={isFav}
      onClick={onOpen}
      onToggleLike={loading ? undefined : handleToggle}
    />
  );
}

export default function FavoritesPage() {
  const router = useRouter();
  const { profile, loading: profileLoading } = useProfile();
  const { favorites, loading, error, setFavorites } = useFavorites(profile?.id ?? "");

  const isLoading = profileLoading || loading;
  const isError = Boolean(error);

  return (
    <section className="min-h-screen bg-[#FCF5F1] px-6 py-8 lg:px-40">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl text-black lg:px-4 lg:text-2xl">Mis favoritos</h1>
          <p className="mt-2 text-sm text-black/60 lg:px-4">
            Productos que guardaste para revisar despues.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="rounded-3xl border border-black/10 bg-white/70 px-6 py-10 text-center">
          <p className="text-base text-black">No pudimos cargar tus favoritos.</p>
          <p className="mt-2 text-sm text-black/60">Intenta recargar la pagina en unos momentos.</p>
        </div>
      )}

      {!isLoading && !isError && favorites.length === 0 && (
        <div className="rounded-3xl border border-black/10 bg-white/70 px-6 py-12 text-center">
          <h2 className="text-lg text-black">Aun no tienes favoritos</h2>
          <p className="mt-2 text-sm text-black/60">
            Guarda productos con el corazon para encontrarlos rapido despues.
          </p>
          <Button
            type="button"
            onPress={() => router.push("/")}
            className="mt-6 rounded-full bg-black/70 px-6 py-2 text-sm text-white"
          >
            Explorar productos
          </Button>
        </div>
      )}

      {!isLoading && !isError && favorites.length > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {favorites.map((product) => (
            <FavoriteItem
              key={product.id}
              product={product}
              profileId={profile!.id}
              onOpen={(productId) => router.push(`/products/${productId}`)}
              onRemoved={(productId) =>
                setFavorites((current) => current.filter((item) => item.id !== productId))
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
