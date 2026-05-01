"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/types"

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  userLoading: boolean
  profileLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setUserLoading(false)
      setProfileLoading(Boolean(user))
      setError(null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setUserLoading(false)
      if (!session?.user) {
        setProfile(null)
      }
      setProfileLoading(Boolean(session?.user))
      setError(null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    if (userLoading || !user) return

    let cancelled = false

    supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return

        if (error) {
          setProfile(null)
          setError(error.message)
        } else {
          setProfile(data)
        }

        setProfileLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [supabase, user, userLoading])

  return (
    <AuthContext.Provider value={{ user, profile, userLoading, profileLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
