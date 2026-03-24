"use client"

import Image from "next/image"
import { CONDITION_LABELS } from "@/components/dashboard/constants"
import type { Product } from "@/components/dashboard/types"

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: { label: "Activo", className: "bg-emerald-100 text-emerald-700" },
  pending_approval: { label: "En revisión", className: "bg-amber-100 text-amber-700" },
  rejected: { label: "Rechazado", className: "bg-rose-100 text-rose-700" },
  reserved: { label: "Reservado", className: "bg-blue-100 text-blue-700" },
  sold: { label: "Vendido", className: "bg-slate-100 text-slate-700" },
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product
  onEdit: (p: Product) => void
  onDelete: (p: Product) => void
}) {
  // Aseguramos un fallback por si llega un estado inesperado
  const statusConfig = STATUS_CONFIG[product.status] || STATUS_CONFIG.active

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          alt={product.title}
          src={product.imageUrl}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Condition badge (Left) */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm">
          {CONDITION_LABELS[product.condition]}
        </span>

        {/* Status badge (Right) */}
        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm backdrop-blur-sm ${statusConfig.className}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">{product.title}</h3>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-orange-500">
            ${product.price.toLocaleString("es-MX")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 rounded-lg border border-slate-200 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 rounded-lg bg-rose-50 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}