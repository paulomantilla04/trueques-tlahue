"use client"

import { useEffect, useRef, useState, startTransition, type FormEvent, type MouseEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSearchFilters } from "@/components/home/SearchContext"
import { Button } from "@heroui/react"

interface SearchOverlayProps {
  onClose: () => void
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchFilters = useSearchFilters()

  const initialQuery = searchParams.get("q") ?? ""

  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      onClose()
    }
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams()
    const trimmedQuery = query.trim()

    if (trimmedQuery.length > 0) {
      params.set("q", trimmedQuery)
    }

    if (searchFilters) {
      searchFilters.setSearch(trimmedQuery.length > 0 ? trimmedQuery : undefined)
    }

    const url = params.toString() ? `/?${params.toString()}` : "/"

    startTransition(() => {
      router.push(url)
    })
    onClose()
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-0"
      onMouseDown={handleOverlayClick}
    >
      <form
        onSubmit={handleSearch}
        className="w-full bg-[#FCF7F1] p-4 shadow-2xl rounded-b-4xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="relative flex items-center gap-2 mt-10 mb-4">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Qué estás buscando?"
            className="w-full rounded-2xl bg-[#EEE5DC] px-6 py-4 text-sm text-black outline-none transition"
          />
          <Button
            type="submit"
            className='bg-[#C9B6AC] text-[#816D59] rounded-xl absolute right-2 top-1/2 -translate-y-1/2'
            aria-label="Buscar"
          >
            Buscar
          </Button>
        </div>
      </form>
    </div>
  )
}
