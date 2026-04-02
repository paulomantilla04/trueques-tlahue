"use client"

import { useEffect, useRef, useState, startTransition, type FormEvent, type MouseEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RiSearchLine } from "react-icons/ri"
import { useSearchFilters } from "@/components/home/SearchContext"
import type { ProductCondition } from "@/hooks/useProducts"

interface SearchOverlayProps {
  onClose: () => void
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchFilters = useSearchFilters()

  const initialQuery = searchParams.get("q") ?? ""
  const initialCondition = searchParams.get("condition") ?? ""

  const [query, setQuery] = useState(initialQuery)
  const [condition, setCondition] = useState(initialCondition)

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
    const selectedCondition = condition.trim().length > 0 ? (condition as ProductCondition) : undefined

    if (trimmedQuery.length > 0) {
      params.set("q", trimmedQuery)
    }

    if (selectedCondition) {
      params.set("condition", selectedCondition)
    }

    if (searchFilters) {
      searchFilters.setSearch(trimmedQuery.length > 0 ? trimmedQuery : undefined)
      searchFilters.setCondition(selectedCondition)
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
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 pt-24"
      onMouseDown={handleOverlayClick}
    >
      <form
        onSubmit={handleSearch}
        className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="relative flex items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Qué estás buscando?"
            className="w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-black outline-none transition focus:border-black/70"
          />
          <button
            type="submit"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition hover:bg-slate-900"
            aria-label="Buscar"
          >
            <RiSearchLine className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-black w-full sm:w-auto">
            <span className="whitespace-nowrap text-black/70">Condición</span>
            <select
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
              className="bg-transparent text-sm text-black outline-none"
            >
              <option value="">Todas</option>
              <option value="new">Nuevo</option>
              <option value="like_new">Como nuevo</option>
              <option value="good">Bueno</option>
              <option value="fair">Regular</option>
              <option value="poor">Malo</option>
            </select>
          </label>
        </div>
      </form>
    </div>
  )
}
