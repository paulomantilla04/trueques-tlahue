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

const MESSAGES_PATH = "/messages"
const FAVORITES_PATH = "/favorites"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  const userHref = user ? "/dashboard" : "/login"
  const isMessagesActive = pathname === MESSAGES_PATH
  const isFavoritesActive = pathname === FAVORITES_PATH

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="flex items-center justify-between px-6 lg:px-38 py-6 relative bg-[#FCF5F1]">

      {/* Nav para pc */}
      <nav className="hidden md:flex items-center gap-6 px-16 ">
        
        <Link href="/" className="text-black text-lg hover:opacity-70 transition-opacity">Inicio</Link>
        <Link href="/catalogo" className="text-black text-lg hover:opacity-70 transition-opacity">Catálogo</Link>
      </nav>

   
      <div className="flex items-center justify-center absolute left-1/2 -translate-x-1/2">
        <Image src="/trueques-logoB.svg" alt="logo" width={45} height={45} />
      </div>

      {/* Iconos */}
      <div className="hidden md:flex items-center gap-4 px-16">
        <Button isIconOnly variant="ghost" className="text-black hover:bg-transparent">
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

      {/* hambuerga en movil  */}
      <Button
        isIconOnly
        variant="ghost"
        className="md:hidden text-black hover:bg-transparent ml-auto"
        onPress={() => setMenuOpen(prev => !prev)}
      >
        {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </Button>

     
      {menuOpen && (
        <div className="absolute top-full right-4 z-50 bg-white shadow-lg rounded-2xl p-4 w-64 flex flex-col gap-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/" className="text-black text-lg hover:opacity-70 transition-opacity" onClick={closeMenu}>Inicio</Link>
            <Link href="/catalogo" className="text-black text-lg hover:opacity-70 transition-opacity" onClick={closeMenu}>Catálogo</Link>
          </nav>

          <div className="flex justify-around border-t border-[#D9D1C7] pt-4">
            <Button isIconOnly variant="ghost" className="text-black hover:bg-transparent">
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
