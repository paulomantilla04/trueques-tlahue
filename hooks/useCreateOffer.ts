"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useProfile } from "@/hooks/useProfile"
import type { Database } from "@/types/database"

type OfferType = Database["public"]["Enums"]["offer_type"]

interface StartChatParams {
  productId: string
  offerType: OfferType
  proposedPrice: number
  initialMessage: string
}

export function useCreateOffer() {
  const supabase = createClient()
  const { profile } = useProfile()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startChat = async ({ productId, offerType, proposedPrice, initialMessage }: StartChatParams) => {
    if (!profile?.id) {
      setError("Debes iniciar sesiÃ³n para hacer una oferta.")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const { data: existingOffer, error: checkError } = await supabase
        .from("offers")
        .select("id")
        .eq("product_id", productId)
        .eq("buyer_id", profile.id)
        .in("status", ["pending", "countered"])
        .maybeSingle()

      if (checkError) throw new Error(checkError.message)

      if (existingOffer) {
        return existingOffer.id
      }

      const { data: offerData, error: offerError } = await supabase
        .from("offers")
        .insert({
          product_id: productId,
          buyer_id: profile.id,
          type: offerType,
          proposed_price: proposedPrice,
        })
        .select("id")
        .single()

      if (offerError) throw new Error(offerError.message)

      const newOfferId = offerData.id

      if (initialMessage.trim()) {
        const { error: msgError } = await supabase
          .from("messages")
          .insert({
            offer_id: newOfferId,
            sender_id: profile.id,
            body: initialMessage.trim(),
          })

        if (msgError) throw new Error(msgError.message)
      }

      return newOfferId
    } catch (err: unknown) {
      console.error("Error al iniciar conversaciÃ³n:", err)
      const message = err instanceof Error ? err.message : "Unknown error"

      if (message.includes("A seller cannot make an offer")) {
        setError("No puedes hacer una oferta por tu propio producto.")
      } else {
        setError("Hubo un error al iniciar la conversaciÃ³n. IntÃ©ntalo de nuevo.")
      }

      return null
    } finally {
      setLoading(false)
    }
  }

  return { startChat, loading, error }
}
