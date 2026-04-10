"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { Card, Button } from "@heroui/react"
import { useProducts } from "@/hooks/useProducts"
import { FeaturedProductsSkeleton } from "./productsSkeletonCarousel"
import { useRouter } from "next/navigation"



type ProductFull = ReturnType<typeof useProducts>['products'][0]

export function FeaturedProducts() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [shuffledProducts, setShuffledProducts] = useState<ProductFull[]>([])
  const { products, loading } = useProducts()
  const router = useRouter()

  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShuffledProducts(shuffled)
    }
  }, [products])

  if (loading) return <FeaturedProductsSkeleton />
  if (shuffledProducts.length === 0) return null

  const totalSlides = shuffledProducts.length
  const main = shuffledProducts[currentSlide]

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)

  return (
    <section className="px-6 lg:px-40 py-4">
      <div className="flex gap-4 h-64 sm:h-72 md:h-80 lg:h-96">

        {/* Carrusel princiapl */}
        <Card className="relative flex-[1.4] md:flex-[1.6] cursor-pointer rounded-3xl overflow-hidden border-none shadow-none bg-gray-100" onClick={() => router.push(`/products/${main.id}`)}>
          <Image
            src={main.product_images[0]?.url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover scale-110 blur-lg opacity-40"
            aria-hidden
          />
          <Image
            src={main.product_images[0]?.url}
            alt={main.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover z-10"
            priority
          />
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/50 backdrop-blur-md rounded-3xl px-5 py-3 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-base lg:text-lg">{main.title}</h3>
              <p className="text-white/90 text-sm">${main.price}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                isIconOnly
                size="sm"
                variant="outline"
                onPress={prevSlide}
                className="w-8 h-8 min-w-8 rounded-full bg-white/20 border-white/40 border-2 backdrop-blur-md text-white/60 hover:scale-90 transition-all duration-300"
                aria-label="Anterior"
              >
                <FiChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white text-xs px-2 font-medium py-1">
                {currentSlide + 1}/{totalSlides}
              </span>
              <Button
                isIconOnly
                size="sm"
                variant="outline"
                onPress={nextSlide}
                className="w-8 h-8 min-w-8 rounded-full bg-white/20 border-white/40 border-2 backdrop-blur-md text-white/60 hover:scale-90 transition-all duration-300"
                aria-label="Siguiente"
              >
                <FiChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
