"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type ChatListItem = {
  id: string
  offerId: string
  name: string
  avatar: string
  lastMessage: string
  isYou: boolean
  timestamp: number
  status: string
  type: string
  isBuyer: boolean
  product: {
    title: string
    condition: string
    image: string
  }
}

export function useChatList() {
  const supabase = createClient()
  const [chats, setChats] = useState<ChatListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchChats = async () => {
      // 1. Obtenemos la sesión de auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (!cancelled) setLoading(false)
        return
      }

      // 2. Obtenemos nuestro verdadero profile.id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_user_id', user.id)
        .single()

      if (!profile) {
        if (!cancelled) setLoading(false)
        return
      }

      const myProfileId = profile.id

      // 3. Traemos las ofertas (El RLS de Supabase filtra automáticamente para darnos SOLO las nuestras)
const { data, error } = await supabase
        .from('offers')
        .select(`
          id,
          buyer_id,
          type,
          status,
          created_at,
          product:products (
            seller_id,
            title,           
            condition,       
            product_images ( 
              url
            ),
            seller:profiles!products_seller_id_fkey (id, display_name, avatar_url)
          ),
          buyer:profiles!offers_buyer_id_fkey (id, display_name, avatar_url),
          messages (
            id,
            body,
            sender_id,
            sent_at
          )
        `)
      if (error) {
        console.error("Error al cargar la lista de chats:", error.message)
        if (!cancelled) setLoading(false)
        return
      }


      const formattedChats = (data || [])
        .map((offer: any) => {
          const isBuyer = offer.buyer_id === myProfileId
          
          const otherPerson = isBuyer 
            ? offer.product?.seller 
            : offer.buyer

          const sortedMessages = (offer.messages || []).sort(
            (a: any, b: any) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
          )
          const lastMsg = sortedMessages[0]

          const mainImage = offer.product?.product_images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&q=80"
         
          return {
            id: offer.id,
            offerId: offer.id,
            name: otherPerson?.display_name || "Usuario",
            avatar: otherPerson?.avatar_url || `https://ui-avatars.com/api/?name=${otherPerson?.display_name || 'U'}&background=f97316&color=fff`,
            lastMessage: lastMsg?.body || (isBuyer ? "Esperando respuesta del vendedor..." : "¡Tienes una nueva oferta!"),
            isYou: lastMsg?.sender_id === myProfileId,
            timestamp: lastMsg ? new Date(lastMsg.sent_at).getTime() : new Date(offer.created_at).getTime(),
            status: offer.status,
            type: offer.type,
            isBuyer,
            product: {
              title: offer.product?.title || "Producto no disponible",
              condition: offer.product?.condition || "unknown",
              image: mainImage
            }
          }
        })
        .sort((a, b) => b.timestamp - a.timestamp)

      if (!cancelled) {
        setChats(formattedChats)
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => fetchChats(), 0)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [])

  return { chats, loading }
}
