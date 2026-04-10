"use client";

import { useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface FilterPanelProps {
  categories: Category[];
  onFilterChange?: (filters: { categories: string[] }) => void;
}

export function FiltroPanel({ categories, onFilterChange }: FilterPanelProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

  const selecionarCategory = (id: string) => {
    const updated = selectedCategoryId === id ? undefined : id;
    setSelectedCategoryId(updated);
    onFilterChange?.({ categories: updated ? [updated] : [] });
  };

  const limpiarCategory = () => {
    setSelectedCategoryId(undefined);
    onFilterChange?.({ categories: [] });
  };

  return (
    <div className="p-4 rounded-2xl bg-white shadow-lg w-54  md:w-64 border border-[#D9D1C7]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium text-black">Categorias</h2>
        <button onClick={limpiarCategory} className="text-sm text-orange-400">
          Limpiar
        </button>
      </div>

      <div className="overflow-y-auto max-h-52 flex flex-col pr-1">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-[#D9D1C7]/20 rounded-xl"
          >
            <input
              type="radio"
              name="category-filter"
              checked={selectedCategoryId === category.id}
              onChange={() => selecionarCategory(category.id)}
              className="w-4 h-4 cursor-pointer accent-orange-400"
            />
            <span className="text-sm text-black/70">{category.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
