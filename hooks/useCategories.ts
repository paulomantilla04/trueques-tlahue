'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/types'

export type CategoryWithChildren = Category & {
  children: Category[]
} 
 export function useCategories() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [tree, setTree]             = useState<CategoryWithChildren[]>([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => {
        if (!data) return
        setCategories(data)

        // Build parent → children tree for nested dropdowns
        const roots = data.filter(c => !c.parent_id) as CategoryWithChildren[]
        roots.forEach(root => {
          root.children = data.filter(c => c.parent_id === root.id)
        })
        setTree(roots)
        setLoading(false)
      })
  }, [])

  return { categories, tree, loading,  }
}
