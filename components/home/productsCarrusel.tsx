"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { Card, Button } from "@heroui/react"
import { useProducts } from "@/hooks/useProducts"


type ProductFull = ReturnType<typeof useProducts>['products'][0]

export function FeaturedProducts() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sideProduct, setSideProduct] = useState<ProductFull | null>(null)
  const [shuffledProducts, setShuffledProducts] = useState<ProductFull[]>([])
  const { products, loading } = useProducts()

  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShuffledProducts(shuffled)

      const randomIdx = Math.floor(Math.random() * products.length)
      setSideProduct(products[randomIdx])
    }
  }, [products.length])

  if (loading || shuffledProducts.length === 0) return null

  const totalSlides = shuffledProducts.length
  const main = shuffledProducts[currentSlide]

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)

  return (
    <section className="px-6 lg:px-52 py-4">
      <div className="flex gap-4 h-64 sm:h-72 md:h-80 lg:h-96">

        {/* Carrusel princiapl */}
        <Card className="relative flex-[1.4] md:flex-[1.6] rounded-3xl overflow-hidden border-none shadow-none bg-gray-100">
          <Image
            src={main.product_images[0]?.url }
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover scale-110 blur-lg opacity-40"
            aria-hidden
          />
          <Image
            src={main.product_images[0]?.url }
            alt={main.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-contain z-10"
            priority
          />
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/50 backdrop-blur-md rounded-2xl px-5 py-3 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-base lg:text-lg">{main.title}</h3>
              <p className="text-white/90 text-sm">${main.price}</p>
            </div>
            <div className="absolute bottom-5 right-5 flex items-center gap-1.5">
              <Button isIconOnly size="sm" variant="secondary" onPress={prevSlide}
                className="w-8 h-8 min-w-8 rounded-full bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30"
                aria-label="Anterior">
                <FiChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white text-xs px-2 font-medium bg-black/30 backdrop-blur-md rounded-full py-1">
                {currentSlide + 1}/{totalSlides}
              </span>
              <Button isIconOnly size="sm" variant="secondary" onPress={nextSlide}
                className="w-8 h-8 min-w-8 rounded-full bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/30"
                aria-label="Siguiente">
                <FiChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Lado derecho */}
        {sideProduct && (
          <Card className="hidden md:block relative flex-1 rounded-3xl overflow-hidden border-none shadow-none bg-gray-100">
            <Image
              src={sideProduct.product_images[0]?.url}
              alt=""
              fill
              sizes="40vw"
              className="object-cover scale-110 blur-lg opacity-40"
              aria-hidden
            />
            <Image
              src={sideProduct.product_images[0]?.url }
              alt={sideProduct.title}
              fill
              sizes="40vw"
              className="object-contain z-10"
            />
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/50 backdrop-blur-md rounded-2xl px-5 py-3">
              <h3 className="text-white font-semibold text-base lg:text-lg">{sideProduct.title}</h3>
              <p className="text-white/90 text-sm">${sideProduct.price}</p>
            </div>
          </Card>
        )}

      </div>
    </section>
  )
}