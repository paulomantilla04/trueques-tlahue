"use client"

import { useState } from "react"
import { FiSearch, FiMessageSquare, FiHeart, FiUser, FiMenu, FiX } from "react-icons/fi"
import { Button } from "@heroui/react"
import Image from "next/image"
import Link from "next/link"


export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

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
          <FiSearch className="w-5 h-5" />
        </Button>
        <Button isIconOnly variant="ghost" className="text-black hover:bg-transparent">
          <FiMessageSquare className="w-5 h-5" />
        </Button>
        <Button isIconOnly variant="ghost" className="text-black hover:bg-transparent">
          <FiHeart className="w-5 h-5" />
        </Button>
        <Button isIconOnly variant="ghost" className="text-black hover:bg-transparent">
          <FiUser className="w-5 h-5" />
        </Button>
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
            <Link href="/" className="text-black text-lg hover:opacity-70 transition-opacity">Inicio</Link>
            <Link href="/catalogo" className="text-black text-lg hover:opacity-70 transition-opacity">Catálogo</Link>
          </nav>

          <div className="flex justify-around border-t border-[#D9D1C7] pt-4">
            <Button isIconOnly variant="ghost" className="text-black hover:bg-transparent">
              <FiSearch className="w-6 h-6" />
            </Button>
            <Button isIconOnly variant="ghost" className="text-black hover:bg-transparent">
              <FiMessageSquare className="w-6 h-6" />
            </Button>
            <Button isIconOnly variant="ghost" className="text-black hover:bg-transparent">
              <FiHeart className="w-6 h-6" />
            </Button>
            <Button isIconOnly variant="ghost" className="text-black hover:bg-transparent">
              <FiUser className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}