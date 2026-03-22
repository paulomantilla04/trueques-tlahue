'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { OfferFull } from './useOffer'

type Mode = 'by-product' | 'by-buyer'

export function useOffers(mode: Mode, id: string) {
  const supabase = createClient()
  const [offers, setOffers]   = useState<OfferFull[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    let query = supabase
      .from('offers')
      .select(`
        *,
        barter_items ( id, title, description, estimated_value, owner_id ),
        products     ( id, title, price, status, seller_id ),
        buyer:profiles!offers_buyer_id_fkey ( id, display_name, avatar_url )
      `)
      .order('created_at', { ascending: false })

    if (mode === 'by-product') {
      query = query.eq('product_id', id)
    } else {
      query = query.eq('buyer_id', id)
    }

    query.then(({ data }) => {
      if (data) setOffers(data as OfferFull[])
      setLoading(false)
    })
  }, [mode, id])

  return { offers, loading, setOffers }
}