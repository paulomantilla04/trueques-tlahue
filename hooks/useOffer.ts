'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Offer } from '@/types'

export type OfferFull = Offer & {
  barter_items: {
    id: string
    title: string
    description: string | null
    estimated_value: number | null
    owner_id: string
  }[]
  products: {
    id: string
    title: string
    price: number | null
    status: string
    seller_id: string
  }
  buyer: {
    id: string
    display_name: string
    avatar_url: string | null
  }
}

export function useOffer(offerId: string) {
  const supabase = createClient()
  const [offer, setOffer]   = useState<OfferFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  useEffect(() => {
    if (!offerId) return

    supabase
      .from('offers')
      .select(`
        *,
        barter_items ( id, title, description, estimated_value, owner_id ),
        products     ( id, title, price, status, seller_id ),
        buyer:profiles!offers_buyer_id_fkey ( id, display_name, avatar_url )
      `)
      .eq('id', offerId)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setOffer(data as OfferFull)
        setLoading(false)
      })
  }, [offerId])

  return { offer, loading, error, setOffer }
}