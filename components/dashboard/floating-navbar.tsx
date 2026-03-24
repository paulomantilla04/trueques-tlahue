"use client"

import { useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Link, Button } from "@heroui/react"
import { createClient } from "@/lib/supabase/client"
import { useProfile } from "@/hooks/useProfile" // <-- Importamos el hook

type NavItem = {
  label: string
  href: string
  adminOnly?: boolean // <-- Nuevo campo opcional
}

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio",     href: "/"          },
  { label: "Perfil",     href: "/profile"   },
  { label: "Dashboard",  href: "/dashboard" },
  { label: "Admin",      href: "/admin", adminOnly: true }, // <-- Nuestro link protegido
]

export function FloatingNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { profile } = useProfile() // <-- Traemos la info del usuario logueado
  
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.refresh()
    router.push("/login")
  }

  // Filtramos los items: Si pide ser admin, revisamos que el rol coincida
  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || profile?.role === "admin"
  )

  return (
    <nav className="fixed left-1/2 top-5 z-50 w-[min(94vw,780px)] -translate-x-1/2">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/95 px-5 py-3.5 shadow-md backdrop-blur-sm">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Image
            alt="Trueques Tlahue"
            src="/trueques-logoB.svg"
            width={40}
            height={40}
          />
        </div>

        {/* Enlaces y Acciones */}
        <div className="flex items-center gap-1">
          {visibleNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "no-underline rounded-xl bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-orange-600"
                    : "no-underline rounded-xl px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }
              >
                {item.label}
              </Link>
            )
          })}

          {/* Divisor */}
          <div className="mx-1 h-5 w-px bg-slate-200" />

          {/* Botón de Cerrar Sesión (Icon Only) */}
          <Button
            isIconOnly
            onPress={handleLogout}
            className="text-rose-100 bg-rose-500 hover:bg-rose-100 hover:text-rose-500 rounded-xl"
            aria-label="Cerrar sesión"
          >
            {!isLoggingOut && (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-5 h-5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" 
                />
              </svg>
            )}
          </Button>
        </div>

      </div>
    </nav>
  )
}