"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Card } from "@heroui/react"
import { createClient } from "@/lib/supabase/client"
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({ subsets: ["latin"] })

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [userName, setUserName] = useState<string>("Cargando...")
  const [loading, setLoading] = useState(false)
  
  

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const name = "Usuario"
        setUserName(user.user_metadata?.display_name || name)
      }
    }
    
    fetchUser()
  }, [supabase])

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.refresh()
    router.push("/login") 
  }

  return (
    <main className={`flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 ${montserrat.className}`}>
      <Card
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)]"
        variant="default"
      >
        <Card.Header className="flex flex-col items-center gap-2 pb-2 pt-4">
          <h1 className="text-2xl font-bold text-slate-900">¡Hola, {userName}!</h1>
          <p className="text-sm text-slate-500">Trueques Tlahue - Dashboard</p>
        </Card.Header>

        <Card.Content className="pt-6 pb-2">
          <Button
            className="w-full bg-rose-500 text-white hover:bg-rose-600 rounded-lg font-medium"
            isDisabled={loading}
            onPress={handleLogout}
          >
            {loading ? "Cerrando sesión..." : "Cerrar sesión"}
          </Button>
        </Card.Content>
      </Card>
    </main>
  )
}