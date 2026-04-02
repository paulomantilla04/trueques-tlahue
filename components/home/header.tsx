"use client"

import { useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"
import {
  RiHeart3Fill,
  RiHeart3Line,
  RiMessage3Fill,
  RiMessage3Line,
  RiSearchLine,
  RiUserLine,
} from "react-icons/ri"
import { Button } from "@heroui/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/hooks/useUser"
import { SearchOverlay } from "@/components/home/SearchOverlay"

const MESSAGES_PATH = "/messages"
const FAVORITES_PATH = "/favorites"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  const userHref = user ? "/dashboard" : "/login"
  const isMessagesActive = pathname === MESSAGES_PATH
  const isFavoritesActive = pathname === FAVORITES_PATH

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="relative bg-[#FCF5F1] px-6 py-6 lg:px-38">
      <div className="flex items-center justify-between">
        <nav className="hidden md:flex items-center gap-6 px-16">
          <Link href="/" className="text-black text-lg hover:opacity-70 transition-opacity">Inicio</Link>
          <Link href="/catalogo" className="text-black text-lg hover:opacity-70 transition-opacity">Catálogo</Link>
        </nav>

        <div className="flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Image src="/trueques-logoB.svg" alt="logo" width={45} height={45} />
        </div>

        <div className="hidden md:flex items-center gap-4 px-16">
          <Button
            isIconOnly
            variant="ghost"
            className={`text-black hover:bg-transparent ${searchOverlayOpen ? "bg-black/10" : ""}`}
            onPress={() => setSearchOverlayOpen((prev) => !prev)}
            aria-label={searchOverlayOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
          >
            <RiSearchLine className="w-5 h-5" />
          </Button>
          <Link
            href={MESSAGES_PATH}
            aria-label="Mensajes"
            className="inline-flex items-center justify-center rounded-full p-2 text-black transition-opacity hover:opacity-70"
          >
            {isMessagesActive ? (
              <RiMessage3Fill className="w-5 h-5 text-orange-500" />
            ) : (
              <RiMessage3Line className="w-5 h-5" />
            )}
          </Link>
          <Link
            href={FAVORITES_PATH}
            aria-label="Favoritos"
            className="inline-flex items-center justify-center rounded-full p-2 text-black transition-opacity hover:opacity-70"
          >
            {isFavoritesActive ? (
              <RiHeart3Fill className="w-5 h-5 text-orange-500" />
            ) : (
              <RiHeart3Line className="w-5 h-5" />
            )}
          </Link>
          <Link
            href={userHref}
            aria-label="Usuario"
            className="inline-flex items-center justify-center rounded-full p-2 text-black transition-opacity hover:opacity-70"
          >
            <RiUserLine className="w-5 h-5" />
          </Link>
        </div>

        <Button
          isIconOnly
          variant="ghost"
          className="md:hidden text-black hover:bg-transparent ml-auto"
          onPress={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </Button>
      </div>

      {searchOverlayOpen && <SearchOverlay onClose={() => setSearchOverlayOpen(false)} />}

      {menuOpen && (
        <div className="absolute top-full right-4 z-50 bg-white shadow-lg rounded-2xl p-4 w-64 flex flex-col gap-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/" className="text-black text-lg hover:opacity-70 transition-opacity" onClick={closeMenu}>Inicio</Link>
            <Link href="/catalogo" className="text-black text-lg hover:opacity-70 transition-opacity" onClick={closeMenu}>Catálogo</Link>
          </nav>

          <div className="flex justify-around border-t border-[#D9D1C7] pt-4">
            <Button
              isIconOnly
              variant="ghost"
              className="text-black hover:bg-transparent"
              onPress={() => setSearchOverlayOpen((prev) => !prev)}
              aria-label={searchOverlayOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
            >
              <RiSearchLine className="w-6 h-6" />
            </Button>
            <Link
              href={MESSAGES_PATH}
              aria-label="Mensajes"
              onClick={closeMenu}
              className="inline-flex items-center justify-center rounded-full p-2 text-black transition-opacity hover:opacity-70"
            >
              {isMessagesActive ? (
                <RiMessage3Fill className="w-6 h-6 text-orange-500" />
              ) : (
                <RiMessage3Line className="w-6 h-6" />
              )}
            </Link>
            <Link
              href={FAVORITES_PATH}
              aria-label="Favoritos"
              onClick={closeMenu}
              className="inline-flex items-center justify-center rounded-full p-2 text-black transition-opacity hover:opacity-70"
            >
              {isFavoritesActive ? (
                <RiHeart3Fill className="w-6 h-6 text-orange-500" />
              ) : (
                <RiHeart3Line className="w-6 h-6" />
              )}
            </Link>
            <Link
              href={userHref}
              aria-label="Usuario"
              onClick={closeMenu}
              className="inline-flex items-center justify-center rounded-full p-2 text-black transition-opacity hover:opacity-70"
            >
              <RiUserLine className="w-6 h-6" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
