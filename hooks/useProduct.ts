'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'

// Product enriched with its images, seller, and category
export type ProductFull = Product & {
  product_images: { id: string; url: string; sort_order: number }[]
  profiles:       { id: string; display_name: string; avatar_url: string | null; created_at: string }
  categories:     { id: string; name: string; slug: string }
}

export function useProduct(id: string) {
  const supabase = createClient()
  const [product, setProduct] = useState<ProductFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    supabase
      .from('products')
      .select(`
        *,
        product_images ( id, url, sort_order ),
        profiles!products_seller_id_fkey ( id, display_name, avatar_url, created_at ),
        categories     ( id, name, slug )
      `)
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setProduct(data as ProductFull)
        setLoading(false)
      })
  }, [id])

  return { product, loading, error }
}