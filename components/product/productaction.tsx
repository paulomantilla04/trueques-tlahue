"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@heroui/react"
import { RiShoppingBag3Line, RiRepeatLine, RiLoader4Line } from "react-icons/ri"
import { useCreateOffer } from "@/hooks/useCreateOffer"
import { useProfile } from "@/hooks/useProfile"
import type { Database } from "@/types/database"

type OfferType = Database['public']['Enums']['offer_type']

interface Product {
  id: string
  title: string
  price: number | null
}

interface ProductActionProps {
  product: Product
}

export const ProductAction = ({ product }: ProductActionProps) => {
  const [sending, setSending] = useState(false)
  const router = useRouter()
  const { loading: profileLoading } = useProfile()
  const { startChat } = useCreateOffer()

 const handleMakerOffer = async () => {
  if (sending || profileLoading) return

  setSending(true)
  try {
    const offerId = await startChat({
      productId: product.id,
      offerType: "negotiation" as OfferType,
      proposedPrice: product.price ?? 0,
      initialMessage: `Hola me interesa tu "${product.title}"`,
    })

    if (offerId) {
      await new Promise((resolve) => setTimeout(resolve, 900))
      router.push(`/messages/${offerId}`)
      return
    }


    setSending(false)
  } catch (error) {
    console.error(error)
    setSending(false) 
  }
}

  if (profileLoading) {
    return (
      <div className="flex gap-3 mt-auto">
        <div className="h-14 flex-1 animate-pulse rounded-2xl bg-black/5" />
        <div className="h-14 flex-1 animate-pulse rounded-2xl bg-black/5" />
      </div>
    )
  }

  return (
    <>
  
      {sending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-black/8 shadow-xl shadow-black/10 rounded-2xl px-6 py-4">
            <RiLoader4Line className="w-5 h-5 text-orange-500 animate-spin" />
            <p className="text-sm font-semibold text-black/70">Enviando mensaje...</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-auto">
        <Button
          onPress={handleMakerOffer}
          isDisabled={sending || profileLoading}
          size="lg"
          className={`flex-1 flex items-center justify-center gap-2 rounded-2xl ${
            sending
              ? "bg-orange-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"
          } text-white font-semibold py-4 text-sm transition-all duration-150 shadow-sm shadow-orange-200`}
        >
          <RiShoppingBag3Line className="w-5 h-5" />
          Comprar
        </Button>

        <Button
          size="lg"
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-black/10 bg-white/70 hover:bg-white active:scale-[0.98] text-black/80 hover:text-black font-semibold py-4 text-sm transition-all duration-150"
        >
          <RiRepeatLine className="w-5 h-5" />
          Truequear
        </Button>
      </div>
    </>
  )
}
