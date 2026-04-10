"use client";

import { use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import {
  RiArrowLeftLine,
  RiShoppingBag3Line,
  RiRepeatLine,
  RiPriceTag3Line,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import { useProduct } from "@/hooks/useProduct";
import { useProfile } from "@/hooks/useProfile";
import { useFavorites } from "@/hooks/useFavorites";
import FavoriteButton from "@/components/product/favorite-button";
import { Button } from "@heroui/react";
import ProductDetailedSkeleton from "@/components/product/product-skeleton";
import SellerCard from "@/components/product/seller-card";

const montserrat = Montserrat({ subsets: ["latin"] });

const CONDITION_LABELS: Record<string, string> = {
  new: "Nuevo",
  like_new: "Como nuevo",
  good: "Bueno",
  fair: "Regular",
  poor: "Usado",
};

const CONDITION_COLORS: Record<string, string> = {
  new: "bg-emerald-100 text-emerald-700",
  like_new: "bg-teal-100 text-teal-700",
  good: "bg-blue-100 text-blue-700",
  fair: "bg-amber-100 text-amber-700",
  poor: "bg-slate-100 text-slate-600",
};


export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { product, loading, error } = useProduct(id);
  const { profile } = useProfile();

  // Traemos los favoritos del usuario para saber si este producto ya está guardado
  const { favorites, loading: favLoading } = useFavorites(profile?.id ?? "");
  const isAlreadyFav = favorites.some((f) => f.id === id);

  // Mostramos skeleton mientras carga el producto O los favoritos
  if (loading || favLoading) return <ProductDetailedSkeleton />;

  if (error || !product) {
    return (
      <div
        className={`min-h-screen bg-[#FCF5F1] flex flex-col items-center justify-center gap-4 ${montserrat.className}`}
      >
        <p className="text-black/50 text-lg">Producto no encontrado.</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-orange-500 underline underline-offset-4"
        >
          Volver
        </button>
      </div>
    );
  }

  const mainImage = product.product_images?.[0]?.url ?? "/placeholder-user.png";
  const seller = product.profiles;
  const category = product.categories;
  const condition = product.condition;
  const includedItems = product.included_items
    ? product.included_items
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className={`min-h-screen bg-[#FCF5F1] ${montserrat.className}`}>
      <div className="px-6 py-8 lg:px-24 xl:px-40">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-black/50 hover:text-black transition-colors mb-8 group"
        >
          <RiArrowLeftLine className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Volver
        </button>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-black/5 shadow-sm">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />

              <FavoriteButton
                productId={product.id}
                profileId={profile?.id}
                initialLiked={isAlreadyFav}
              />
            </div>

            {product.product_images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.product_images.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-transparent hover:border-orange-400 transition-all cursor-pointer"
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {category && (
                  <span className="flex items-center gap-1 text-xs font-medium text-black/40 uppercase tracking-widest">
                    <RiPriceTag3Line className="w-3.5 h-3.5" />
                    {category.name}
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    CONDITION_COLORS[condition] ?? "bg-slate-100 text-slate-600"
                  }`}
                >
                  {CONDITION_LABELS[condition] ?? condition}
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-black leading-tight">
                {product.title}
              </h1>

              <p className="text-3xl font-extrabold text-orange-500 tracking-tight">
                ${product.price?.toLocaleString("es-MX") ?? "—"}
                <span className="text-base font-medium text-black/30 ml-1">MXN</span>
              </p>
            </div>

            {product.description && (
              <div className="rounded-2xl bg-white/60 border border-black/6 p-4">
                <p className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-2">
                  Descripción
                </p>
                <p className="text-sm text-black/70 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {includedItems.length > 0 && (
              <div className="rounded-2xl bg-white/60 border border-black/6 p-4">
                <p className="text-sm font-semibold text-black/50 uppercase tracking-wider mb-3">
                  Incluye
                </p>
                <ul className="flex flex-col gap-1.5">
                  {includedItems.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-black/70"
                    >
                      <RiCheckboxCircleLine className="w-4 h-4 text-orange-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {seller && (
              <SellerCard
                seller={{
                  id: seller.id,
                  display_name: seller.display_name,
                  avatar_url: seller.avatar_url,
                  //eslint-disable-next-line @typescript-eslint/no-explicit-any
                  created_at: (seller as any).created_at,
                }}
              />
            )}

            <div className="flex gap-3 mt-auto">
              <Button size="lg" className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold py-4 text-sm transition-all duration-150 shadow-sm shadow-orange-200">
                <RiShoppingBag3Line className="w-5 h-5" />
                Comprar
              </Button>
              <Button size="lg" className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-black/10 bg-white/70 hover:bg-white active:scale-[0.98] text-black/80 hover:text-black font-semibold py-4 text-sm transition-all duration-150">
                <RiRepeatLine className="w-5 h-5" />
                Truequear
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}