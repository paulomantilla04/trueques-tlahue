// app/(main)/admin/page.tsx

"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useAdminProducts } from "@/hooks/useAdminProducts"
import { CONDITION_LABELS } from "@/components/dashboard/constants"
import { Montserrat } from "next/font/google"
import { useRouter } from "next/navigation"
import { useProfile } from "@/hooks/useProfile"

const montserrat = Montserrat({ subsets: ["latin"] })

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse">
      <div className="h-48 w-full bg-slate-200" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 rounded-full bg-slate-200" />
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-2/3 rounded-full bg-slate-100" />
        <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3">
          <div className="h-9 flex-1 rounded-lg bg-slate-100" />
          <div className="h-9 flex-1 rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

function ProductCard({
  product,
  onApprove,
  onReject,
}: {
  product: any
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}) {
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  const handleApprove = async () => {
    setApproving(true)
    try { await onApprove(product.id) } finally { setApproving(false) }
  }

  const handleReject = async () => {
    setRejecting(true)
    try { await onReject(product.id) } finally { setRejecting(false) }
  }

  const busy = approving || rejecting

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          alt={product.title}
          src={product.imageUrl}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Condition badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
          {CONDITION_LABELS[product.condition as keyof typeof CONDITION_LABELS] ?? "Desconocido"}
        </span>
        {/* Pending badge */}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400/90 px-2.5 py-0.5 text-xs font-semibold text-amber-900 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
          Pendiente
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {product.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500">
            ${product.price.toLocaleString("es-MX")}
          </span>
          {product.includedItems && (
            <span className="max-w-[140px] truncate text-right text-xs text-slate-400">
              Incluye: {product.includedItems}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={handleApprove}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {approving ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {approving ? "Aprobando..." : "Aprobar"}
          </button>

          <button
            onClick={handleReject}
            disabled={busy}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {rejecting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" />
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {rejecting ? "Rechazando..." : "Rechazar"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const { profile, loading: profileLoading } = useProfile()
  const { products, loading, error, approveProduct, rejectProduct } = useAdminProducts()
  
  useEffect(() => {
      // Si ya terminó de cargar el perfil y NO es admin, para fuera
      if (!profileLoading && profile?.role !== "admin") {
        router.push("/dashboard") // O a la home "/"
      }
    }, [profile, profileLoading, router])
  
  if (profileLoading || profile?.role !== "admin") {
      return (
        <div className={`min-h-screen bg-slate-100 flex items-center justify-center ${montserrat.className}`}>
          <p className="animate-pulse text-slate-500 font-medium">Verificando permisos...</p>
        </div>
      )
    }
  

  return (
    <div className={`min-h-screen bg-slate-100 ${montserrat.className}`}>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-28">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <h1 className="text-2xl font-bold text-slate-900">Panel de administración</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500 pl-9">
              Revisa y aprueba los productos publicados por los usuarios.
            </p>
          </div>

          {/* Counter badge */}
          {!loading && !error && (
            <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-sm font-semibold text-amber-700">
                {products.length === 0
                  ? "Sin pendientes"
                  : `${products.length} pendiente${products.length !== 1 ? "s" : ""}`}
              </span>
            </div>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold text-rose-700">Ocurrió un error</p>
              <p className="text-sm text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-bold text-slate-900">Todo al día</p>
            <p className="mt-1 text-sm text-slate-400">
              No hay productos pendientes de aprobación.
            </p>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onApprove={approveProduct}
                onReject={rejectProduct}
              />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}