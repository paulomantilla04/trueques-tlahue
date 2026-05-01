'use client'

import { useAuth } from '@/components/providers/auth-provider'

export function useProfile() {
  const { profile, profileLoading, error } = useAuth()

  return { profile, loading: profileLoading, error }
}
