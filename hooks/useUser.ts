'use client'

import { useAuth } from '@/components/providers/auth-provider'

export function useUser() {
  const { user, userLoading } = useAuth()
  return { user, loading: userLoading }
}
