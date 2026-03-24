import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/components/dashboard/types"

export function useAdminProducts() {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const fetchPendingProducts = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from("products")
      .select(`
        id,
        title,
        description,
        condition,
        status,
        included_items,
        price,
        product_images ( url )
      `)
      .eq("status", "pending_approval")
      .order("created_at", { ascending: false })

    if (fetchError) {
      setError("Error al cargar productos pendientes: " + fetchError.message)
      setLoading(false)
      return
    }

    const mapped: Product[] = (data ?? []).map((p: any) => ({
      id: p.id,
      categoryId: p.category_id,
      title:        p.title,
      description:  p.description,
      condition:    p.condition,
      status:       p.status,
      includedItems: p.included_items ?? "",
      price:        Number(p.price),
      imageUrl:     p.product_images?.[0]?.url ?? "/placeholder-image.png",
    }))

    setProducts(mapped)
    setLoading(false)
    setError(null)
  }, [])

  useEffect(() => {
    let cancelled = false

    // El setTimeout defer saca el setState del cuerpo síncrono del effect
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setLoading(true)
        setError(null)
        fetchPendingProducts()
      }
    }, 0)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [fetchPendingProducts])

  const updateProductStatus = async (
    productId: string,
    newStatus: "active" | "rejected"
  ) => {
    const { error: updateError } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", productId)

    if (updateError) {
      throw new Error("No se pudo actualizar el producto: " + updateError.message)
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId))
  }

  const approveProduct = (productId: string) => updateProductStatus(productId, "active")
  const rejectProduct  = (productId: string) => updateProductStatus(productId, "rejected")

  return {
    products,
    loading,
    error,
    approveProduct,
    rejectProduct,
    refresh: fetchPendingProducts,
  }
}