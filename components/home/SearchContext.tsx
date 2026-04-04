"use client"

import { createContext, useContext, useMemo, useState } from "react"
import type { ProductCondition } from "@/hooks/useProducts"

interface SearchFilters {
  search?: string
  condition?: ProductCondition
  setSearch: (value: string | undefined) => void
  setCondition: (value: ProductCondition | undefined) => void
}

const SearchFiltersContext = createContext<SearchFilters | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState<string | undefined>(undefined)
  const [condition, setCondition] = useState<ProductCondition | undefined>(undefined)

  const value = useMemo(
    () => ({ search, condition, setSearch, setCondition }),
    [search, condition],
  )

  return (
    <SearchFiltersContext.Provider value={value}>
      {children}
    </SearchFiltersContext.Provider>
  )
}

export function useSearchFilters() {
  return useContext(SearchFiltersContext)
}
