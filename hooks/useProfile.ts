'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from './useUser'
import type { Profile } from '@/types'

export function useProfile() {
  const { user, loading: userLoading } = useUser()
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    // Wait until auth state is resolved
    if (userLoading) return

    // No user — resolve immediately with null, no async needed
    if (!user) {
      // Use a microtask to defer the state update out of the effect body
      const timeout = setTimeout(() => {
        setProfile(null)
        setLoading(false)
      }, 0)
      return () => clearTimeout(timeout)
    }

    // User exists — fetch their profile
    let cancelled = false

    supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else setProfile(data)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [user, userLoading])

  return { profile, loading, error }
}