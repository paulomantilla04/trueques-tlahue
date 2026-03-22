'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Transaction } from '@/types'

export type TransactionFull = Transaction & {
  transaction_barter_items: {
    id: string
    title: string
    description: string | null
    estimated_value: number | null
  }[]
}

export function useTransaction(offerId: string) {
  const supabase = createClient()
  const [transaction, setTransaction] = useState<TransactionFull | null>(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    if (!offerId) return

    supabase
      .from('transactions')
      .select(`
        *,
        transaction_barter_items ( id, title, description, estimated_value )
      `)
      .eq('offer_id', offerId)
      .maybeSingle()
      .then(({ data }) => {
        setTransaction(data as TransactionFull | null)
        setLoading(false)
      })
  }, [offerId])

  return { transaction, loading, setTransaction }
}