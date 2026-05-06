"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useProfile } from "@/hooks/useProfile"
import { toast } from "react-hot-toast"

export function useOfferActions() {
  const supabase = createClient()
  const { profile } = useProfile()
  const [loading, setLoading] = useState(false)

  const acceptOffer = async (offerId: string): Promise<boolean> => {
    if (!profile?.id) {
      toast.error("Debes iniciar sesión")
      return false
    }

    setLoading(true)
    try {
      const { error } = await supabase.rpc("accept_offer", {
        p_offer_id: offerId,
        p_actor_id: profile.id,
      })

      if (error) throw new Error(error.message)

      toast.success("Oferta aceptada correctamente")
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error"
      console.error("Error accepting offer:", message)
      toast.error(message.includes("Only the seller") 
        ? "Solo el vendedor puede aceptar la oferta" 
        : "Error al aceptar la oferta")
      return false
    } finally {
      setLoading(false)
    }
  }

  const rejectOffer = async (offerId: string): Promise<boolean> => {
    if (!profile?.id) {
      toast.error("Debes iniciar sesión")
      return false
    }

    setLoading(true)
    try {
      const { error } = await supabase.rpc("reject_offer", {
        p_offer_id: offerId,
        p_actor_id: profile.id,
      })

      if (error) throw new Error(error.message)

      toast.success("Oferta rechazada")
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error"
      console.error("Error rejecting offer:", message)
      toast.error(message.includes("Only the seller")
        ? "Solo el vendedor puede rechazar la oferta"
        : "Error al rechazar la oferta")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { acceptOffer, rejectOffer, loading }
}
