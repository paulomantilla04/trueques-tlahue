'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { OfferFull } from './useOffer'

// Attach this to the useOffer hook's setOffer to get live status changes
export function useOfferRealtime(
  offerId: string,
  setOffer: React.Dispatch<React.SetStateAction<OfferFull | null>>
) {
  const supabase = createClient()

  useEffect(() => {
    if (!offerId) return

    const channel = supabase
      .channel(`offer:${offerId}`)
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'offers',
          filter: `id=eq.${offerId}`,
        },
        (payload) => {
          // Merge the updated fields into existing offer state
          setOffer(prev => prev ? { ...prev, ...payload.new } : null)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [offerId])
}