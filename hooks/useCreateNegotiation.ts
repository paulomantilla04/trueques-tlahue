"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useProfile } from "@/hooks/useProfile"
import { toast } from "react-hot-toast"

interface CreateNegotiationParams {
  productId: string
  mode: "price" | "barter"
  proposedPrice?: number
  barterItem?: {
    title: string
    description?: string
    estimatedValue?: number
    imageFile?: File | null
  }
  initialMessage?: string
}

export function useCreateNegotiation() {
  const supabase = createClient()
  const { profile } = useProfile()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadBarterImage = async (offerId: string, file: File): Promise<string> => {
    if (!profile?.id) throw new Error("No hay perfil activo")

    const fileExt = file.name.split(".").pop()
    if (!fileExt) throw new Error("Archivo inválido")

    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${profile.id}/${offerId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file)

    if (uploadError) throw new Error(`Fallo en Storage: ${uploadError.message}`)

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath)

    return publicUrl
  }

  const createOffer = async ({
    productId,
    mode,
    proposedPrice,
    barterItem,
    initialMessage,
  }: CreateNegotiationParams): Promise<string | null> => {
    // Validate auth session is active
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      setError("Sesión expirada. Inicia sesión de nuevo.")
      toast.error("Sesión expirada. Inicia sesión de nuevo.")
      return null
    }

    if (!profile?.id) {
      setError("Debes iniciar sesión para hacer una oferta.")
      toast.error("Debes iniciar sesión para hacer una oferta.")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      // Check for existing pending/countered offer
      const { data: existingOffer, error: checkError } = await supabase
        .from("offers")
        .select("id")
        .eq("product_id", productId)
        .eq("buyer_id", profile.id)
        .in("status", ["pending", "countered"])
        .maybeSingle()

      if (checkError) throw new Error(checkError.message)
      if (existingOffer) {
        toast.error("Ya tienes una oferta pendiente para este producto.")
        setError("Ya tienes una oferta pendiente para este producto.")
        return null
      }

      // Insert offer
      const { data: offerData, error: offerError } = await supabase
        .from("offers")
        .insert({
          product_id: productId,
          buyer_id: profile.id,
          type: "negotiation",
          proposed_price: mode === "price" ? proposedPrice : null,
        })
        .select("id")
        .single()

      if (offerError || !offerData) throw new Error(offerError?.message || "Error creando oferta")

      const offerId = offerData.id

      // Upload barter image if present
      let barterImageUrl: string | undefined
      if (mode === "barter" && barterItem?.imageFile) {
        barterImageUrl = await uploadBarterImage(offerId, barterItem.imageFile)
      }

      // Insert barter item if barter mode
      if (mode === "barter" && barterItem) {
        const { error: barterError } = await supabase.from("barter_items").insert({
          offer_id: offerId,
          owner_id: profile.id,
          title: barterItem.title,
          description: barterItem.description || null,
          estimated_value: barterItem.estimatedValue || null,
          image_url: barterImageUrl || null,
        })

        if (barterError) throw new Error(barterError.message)
      }

      // Build the offer details message
      const offerDetailsMessage = buildOfferDetailsMessage(mode, proposedPrice, barterItem)

      // Insert offer details as first message (so both parties can see what was offered)
      if (offerDetailsMessage) {
        const { error: detailsError } = await supabase.from("messages").insert({
          offer_id: offerId,
          sender_id: profile.id,
          body: offerDetailsMessage,
        })
        if (detailsError) console.error("Error sending offer details message:", detailsError)
      }

      // Insert optional user message
      if (initialMessage?.trim()) {
        const { error: msgError } = await supabase.from("messages").insert({
          offer_id: offerId,
          sender_id: profile.id,
          body: initialMessage.trim(),
        })
        if (msgError) throw new Error(msgError.message)
      }

      toast.success("Oferta enviada correctamente")
      return offerId
    } catch (err: unknown) {
      console.error("Error al crear oferta:", err)
      const message = err instanceof Error ? err.message : "Unknown error"

      if (message.includes("A seller cannot make an offer")) {
        setError("No puedes hacer una oferta por tu propio producto.")
        toast.error("No puedes hacer una oferta por tu propio producto.")
      } else if (message.includes("row-level security")) {
        setError("Error de permisos. Cierra sesión y vuelve a iniciar.")
        toast.error("Error de permisos. Cierra sesión y vuelve a iniciar.")
      } else {
        setError("Hubo un error al enviar la oferta. Inténtalo de nuevo.")
        toast.error("Hubo un error al enviar la oferta. Inténtalo de nuevo.")
      }

      return null
    } finally {
      setLoading(false)
    }
  }

  return { createOffer, loading, error }
}

function buildOfferDetailsMessage(
  mode: "price" | "barter",
  proposedPrice?: number,
  barterItem?: { title?: string; description?: string; estimatedValue?: number }
): string {
  if (mode === "price" && proposedPrice !== undefined && proposedPrice > 0) {
    return `🛒 Oferta de compra: $${proposedPrice.toLocaleString("es-MX")} MXN`
  }

  if (mode === "barter" && barterItem) {
    const lines = ["🔄 Oferta de trueque:"]
    lines.push(`Artículo: ${barterItem.title}`)
    if (barterItem.description) lines.push(`Descripción: ${barterItem.description}`)
    if (barterItem.estimatedValue && barterItem.estimatedValue > 0) {
      lines.push(`Valor estimado: $${barterItem.estimatedValue.toLocaleString("es-MX")} MXN`)
    }
    return lines.join("\n")
  }

  return ""
}
