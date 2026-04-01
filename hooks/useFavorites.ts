'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ProductFull } from './useProduct'

export function useFavorites(profileId: string) {
  const [supabase] = useState(() => createClient())
  const [favorites, setFavorites] = useState<ProductFull[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    if (!profileId) return

    const timeout = setTimeout(() => {
      if (!cancelled) {
        setLoading(true)
        setError(null)
      }
    }, 0)

    supabase
      .from('favorites')
      .select(`
        product_id,
        products (
          *,
          product_images ( id, url, sort_order ),
          profiles!products_seller_id_fkey ( id, display_name, avatar_url ),
          categories     ( id, name, slug )
        )
      `)
      .eq('user_id', profileId)
      .then(({ data, error }) => {
        if (cancelled) return

        if (error) {
          setError(error.message)
        } else if (data) {
          const products = data
            .map(f => f.products)
            .filter(Boolean) as ProductFull[]
          setFavorites(products)
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [profileId, supabase])

  return {
    favorites: profileId ? favorites : [],
    loading: profileId ? loading : false,
    error: profileId ? error : null,
    setFavorites,
  }
}
