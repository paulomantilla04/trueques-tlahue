"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useProfile } from "@/hooks/useProfile"
import type { Database } from "@/types/database"

export type OfferWithDetails = {
  id: string
  status: Database["public"]["Enums"]["offer_status"]
  type: Database["public"]["Enums"]["offer_type"]
  proposed_price: number | null
  buyer_id: string
  product_id: string
  created_at: string
  product: {
    title: string
    condition: string
    price: number | null
    seller_id: string
    product_images: { url: string }[]
  } | null
  barter_items: {
    id: string
    title: string
    description: string | null
    estimated_value: number | null
    image_url: string | null
  }[]
}

export function useOfferDetails(offerId: string) {
  const supabase = createClient()
  const { profile } = useProfile()
  const [offer, setOffer] = useState<OfferWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!offerId) {
      setLoading(false)
      return
    }

    let cancelled = false

    const fetchOffer = async () => {
      const { data, error } = await supabase
        .from("offers")
        .select(`
          id,
          status,
          type,
          proposed_price,
          buyer_id,
          product_id,
          created_at,
          product:products (
            title,
            condition,
            price,
            seller_id,
            product_images ( url )
          ),
          barter_items (
            id,
            title,
            description,
            estimated_value,
            image_url
          )
        `)
        .eq("id", offerId)
        .single()

      if (!cancelled) {
        if (!error && data) {
          setOffer(data as unknown as OfferWithDetails)
        } else {
          console.error("Error fetching offer details:", error)
          setOffer(null)
        }
        setLoading(false)
      }
    }

    fetchOffer()

    // Subscribe to offer status changes
    const channel = supabase
      .channel(`offer:${offerId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "offers",
          filter: `id=eq.${offerId}`,
        },
        (payload) => {
          setOffer((prev) =>
            prev ? { ...prev, status: payload.new.status } : null
          )
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [offerId, supabase])

  const isSeller = profile?.id === offer?.product?.seller_id
  const isBuyer = profile?.id === offer?.buyer_id

  return { offer, loading, isSeller, isBuyer }
}
