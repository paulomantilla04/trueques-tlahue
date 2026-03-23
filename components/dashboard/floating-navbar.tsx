"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { Link } from "@heroui/react"

type NavItem = {
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio",     href: "/"          },
  { label: "Perfil",     href: "/profile"   },
  { label: "Dashboard",  href: "/dashboard" },
]

export function FloatingNavbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed left-1/2 top-5 z-50 w-[min(94vw,780px)] -translate-x-1/2">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/95 px-5 py-3.5 shadow-md backdrop-blur-sm">

        
        <div className="flex items-center gap-2.5">
          <Image
            alt="Trueques Tlahue"
            src="/trueques-logoB.svg"
            width={40}
            height={40}
          />
        </div>

        
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  isActive
                    ? "rounded-xl bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-orange-600"
                    : "rounded-xl px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }
              >
                {item.label}
              </Link>
            )
          })}
        </div>

      </div>
    </nav>
  )
}