"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useProfile } from "@/hooks/useProfile"
import { toast } from "react-hot-toast"

export function useCancelAcceptedOffer() {
  const supabase = createClient()
  const { profile } = useProfile()
  const [loading, setLoading] = useState(false)

  const cancelOffer = async (offerId: string): Promise<boolean> => {
    if (!profile?.id) {
      toast.error("Debes iniciar sesión")
      return false
    }

    setLoading(true)
    try {
      const { error } = await supabase.rpc("cancel_accepted_offer", {
        p_offer_id: offerId,
        p_actor_id: profile.id,
      })

      if (error) throw new Error(error.message)

      toast.success("Trueque cancelado. El producto está disponible de nuevo.")
      return true
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error"
      console.error("Error canceling accepted offer:", message)
      toast.error(
        message.includes("Only the seller")
          ? "Solo el vendedor puede cancelar este trueque"
          : "Error al cancelar el trueque"
      )
      return false
    } finally {
      setLoading(false)
    }
  }

  return { cancelOffer, loading }
}
