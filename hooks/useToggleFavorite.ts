'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useToggleFavorite(productId: string, profileId: string, initial: boolean) {
  const [supabase] = useState(() => createClient())
  const [isFav, setIsFav] = useState(initial)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (!profileId || loading) return
    setLoading(true)

    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', profileId)
        .eq('product_id', productId)
      setIsFav(false)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: profileId, product_id: productId })
      setIsFav(true)
    }

    setLoading(false)
  }

  return { isFav, toggle, loading }
}
