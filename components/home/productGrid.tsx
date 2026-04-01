"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProductCard } from "./productCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useProfile } from "@/hooks/useProfile";
import { useFavorites } from "@/hooks/useFavorites";
import { useToggleFavorite } from "@/hooks/useToggleFavorite";
import { Button } from "@heroui/react";
import { FiltroPanel } from "./filterCategories";
import { ProductCardSkeleton } from "./productSkeletonCard";
import type { ProductFull } from "@/hooks/useProduct";


const categoryVisibles = 2;

function ProductGridItem({
  product,
  profileId,
  isInitiallyLiked,
  onClick,
}: {
  product: ProductFull;
  profileId?: string;
  isInitiallyLiked: boolean;
  onClick: (id: string) => void;
}) {
  const { isFav, toggle } = useToggleFavorite(
    product.id,
    profileId ?? "",
    isInitiallyLiked,
  );

  return (
    <ProductCard
      id={product.id}
      name={product.title}
      price={product.price ?? 0}
      image={product.product_images[0]?.url ?? "/placeholder-image.jpg"}
      isLiked={isFav}
      onClick={onClick}
      onToggleLike={profileId ? () => void toggle() : undefined}
    />
  );
}

export function ProductGrid() {
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = useState<
    string | undefined
  >();

  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts({
    categoryId: activeCategoryId,
  });
  const { profile } = useProfile();
  const { favorites } = useFavorites(profile?.id ?? "");
  const favoriteIds = new Set(favorites.map((favorite) => favorite.id));

  //clicks fuera del panel
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section className="px-6 py-8 lg:px-40">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-xl lg:text-2xl lg:px-4 text-black">Productos</h2>

        <div className="flex flex-wrap gap-2 items-center">
          <Button
            type="button"
            onClick={() => setActiveCategoryId(undefined)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm transition-all",
              !activeCategoryId
                ? "bg-black/60 text-white"
                : "border-[#D9D1C7] bg-white/30 text-black/60 hover:-translate-y-1 hover:bg-[#D9D1C7]/30",
            )}
          >
            Todos
          </Button>
          {/**categorias visibles */}
          {categories.slice(0, categoryVisibles).map((category) => (
            <Button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm transition-all",
                activeCategoryId === category.id
                  ? "bg-black/60 text-white"
                  : "border-[#D9D1C7] bg-white/30 text-black/60 hover:-translate-y-1 hover:bg-[#D9D1C7]/30",
              )}
            >
              {category.name}
            </Button>
          ))}
          {/* 🏷️Muestra categoría seleccionada si no está en las visibles */}
          {activeCategoryId &&
            !categories
              .slice(0, categoryVisibles)
              .find((c) => c.id === activeCategoryId) && (
              <Button
                type="button"
                onClick={() => setActiveCategoryId(undefined)}
                className="rounded-full border px-5 py-2 text-sm transition-all bg-black/60 text-white"
              >
                {categories.find((c) => c.id === activeCategoryId)?.name} ✕
              </Button>
            )}

          {categories.length > categoryVisibles && (
            <div className="relative" ref={filterRef}>
              <Button
                type="button"
                onClick={() => setShowFilter((prev) => !prev)}
                className={cn(
                  "rounded-full border px-5 py-2 text-sm transition-all",
                  showFilter
                    ? "bg-black/60 text-white"
                    : "border-[#D9D1C7] bg-white/30 text-black/60 hover:-translate-y-1 hover:bg-[#D9D1C7]/30",
                )}
              >
                +{categories.length - categoryVisibles} más
              </Button>

              {showFilter && (
                <div className="fixed  right-4 top-50 z-50 md:absolute md:left-auto md:right-0 md:top-12 md:w-64 md:fixed-none">
                  <FiltroPanel
                    categories={categories.slice(categoryVisibles)}
                    onFilterChange={({ categories: cats }) => {
                      if (cats.length === 1) setActiveCategoryId(cats[0]);
                      else if (cats.length === 0)
                        setActiveCategoryId(undefined);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {(categoriesLoading || productsLoading) && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
      
        </div>
      )}
      {/**productops */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductGridItem
            key={`${product.id}-${favoriteIds.has(product.id) ? "fav" : "plain"}`}
            product={product}
            profileId={profile?.id}
            isInitiallyLiked={favoriteIds.has(product.id)}
            onClick={(id) => router.push(`/products/${id}`)}
          />
        ))}
      </div>

      {!productsLoading && products.length === 0 && (
        <p className="mt-6 text-sm lg:text-xl lg:px-5 text-black/60">
          No hay productos disponibles para esta categoria.
        </p>
      )}
    </section>
  );
}
