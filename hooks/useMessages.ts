'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'

export type MessageWithSender = Message & {
  profiles: { id: string; display_name: string; avatar_url: string | null }
}

export function useMessages(offerId: string) {
  const supabase  = createClient()
  const [messages, setMessages] = useState<MessageWithSender[]>([])
  const [loading, setLoading]   = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!offerId) return

    // Load existing messages
    supabase
      .from('messages')
      .select('*, profiles ( id, display_name, avatar_url )')
      .eq('offer_id', offerId)
      .order('sent_at', { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as MessageWithSender[])
        setLoading(false)
      })

    // Subscribe to new messages in realtime
    const channel = supabase
      .channel(`messages:${offerId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'messages',
          filter: `offer_id=eq.${offerId}`,
        },
        async (payload) => {
          // Fetch the full row with sender info
          const { data } = await supabase
            .from('messages')
            .select('*, profiles ( id, display_name, avatar_url )')
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setMessages(prev => [...prev, data as MessageWithSender])
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [offerId])

  async function sendMessage(body: string, senderId: string) {
    if (!body.trim()) return

    await supabase.from('messages').insert({
      offer_id:  offerId,
      sender_id: senderId,
      body:      body.trim(),
    })
    // No need to setMessages here — the realtime subscription picks it up
  }

  return { messages, loading, sendMessage, bottomRef }
}