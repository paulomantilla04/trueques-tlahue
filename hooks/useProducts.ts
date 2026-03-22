'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'
import type { ProductFull } from './useProduct'

type ProductCondition = Database['public']['Enums']['product_condition']

export interface ProductFilters {
  categoryId?: string
  search?:     string
  condition?:  ProductCondition  
}

const PAGE_SIZE = 20

export function useProducts(filters: ProductFilters = {}, page = 0) {
  const supabase = createClient()
  const [products, setProducts] = useState<ProductFull[]>([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    let cancelled = false

    // Defer the loading flag — same pattern as useProfile
    const timeout = setTimeout(() => {
      if (!cancelled) setLoading(true)
    }, 0)

    let query = supabase
      .from('products')
      .select(`
        *,
        product_images ( id, url, sort_order ),
        profiles       ( id, display_name, avatar_url ),
        categories     ( id, name, slug )
      `, { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }

    if (filters.condition) {
      query = query.eq('condition', filters.condition)
    }

    if (filters.search) {
      query = query.textSearch('search_vector', filters.search, {
        type:   'websearch',
        config: 'spanish',
      })
    }

    query.then(({ data, count, error }) => {
      if (cancelled) return
      if (!error && data) {
        setProducts(data as ProductFull[])
        setTotal(count ?? 0)
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [filters.categoryId, filters.search, filters.condition, page])

  const hasMore = (page + 1) * PAGE_SIZE < total

  return { products, total, hasMore, loading }
}