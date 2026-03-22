'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProductFull } from './useProduct'

export function useFavorites(profileId: string) {
  const supabase  = createClient()
  const [favorites, setFavorites] = useState<ProductFull[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!profileId) return

    supabase
      .from('favorites')
      .select(`
        product_id,
        products (
          *,
          product_images ( id, url, sort_order ),
          profiles       ( id, display_name, avatar_url ),
          categories     ( id, name, slug )
        )
      `)
      .eq('user_id', profileId)
      .then(({ data }) => {
        if (data) {
          const products = data
            .map(f => f.products)
            .filter(Boolean) as ProductFull[]
          setFavorites(products)
        }
        setLoading(false)
      })
  }, [profileId])

  return { favorites, loading, setFavorites }
}