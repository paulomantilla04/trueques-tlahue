import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product, ProductFormData } from "@/components/dashboard/types"
import { useProfile } from "@/hooks/useProfile"

// ID temporal para cumplir con la constraint NOT NULL de category_id
const DEFAULT_CATEGORY_ID = "11111111-0000-0000-0000-000000000001" 

export function useUserProducts() {
  const supabase = createClient()
  const { profile } = useProfile()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)

  const fetchProducts = useCallback(async () => {
    const profileId = profile?.id

    if (!profileId) {
      setTimeout(() => setLoading(false), 0)
      return
    }

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        title,
        description,
        condition,
        status,
        included_items,
        price,
        product_images ( id, url )
      `)
      .eq("seller_id", profileId)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setProducts(
        data.map((p: any) => ({
          id:           p.id,
          title:        p.title,
          description:  p.description,
          condition:    p.condition,
          status:       p.status,
          includedItems: p.included_items ?? "",
          price:        Number(p.price),
          imageUrl:     p.product_images?.[0]?.url ?? "/placeholder-image.png",
        }))
      )
    }

    setLoading(false)
  }, [profile, supabase])

  useEffect(() => {
    let cancelled = false

    const timeout = setTimeout(() => {
      if (!cancelled) {
        setLoading(true)
        fetchProducts()
      }
    }, 0)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [fetchProducts])

  // Subir imagen al bucket
  const uploadProductImage = async (productId: string, file: File) => {
    if (!profile?.id) return null

    const fileExt = file.name.split('.').pop()
    const filePath = `${profile.id}/${productId}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file)

    if (uploadError) {
      console.error("Error subiendo imagen:", uploadError)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const addProduct = async (form: ProductFormData) => {
    if (!profile?.id) throw new Error("No hay perfil activo")

    // 1. Insertar el producto en la BD
    const { data: newProduct, error: productError } = await supabase
      .from("products")
      .insert({
        seller_id: profile.id,
        category_id: DEFAULT_CATEGORY_ID, // TODO: Cambiar cuando tengamos el select
        title: form.title.trim(),
        description: form.description.trim(),
        condition: form.condition,
        included_items: form.includedItems.trim(),
        price: Number(form.price),
        status: "pending_approval" // Estado inicial
      })
      .select("id")
      .single()

    if (productError || !newProduct) {
      throw new Error("Error creando producto: " + productError?.message)
    }

    // 2. Si hay imagen, subirla a Storage y enlazarla en product_images
    if (form.imageFile) {
      const imageUrl = await uploadProductImage(newProduct.id, form.imageFile)
      if (imageUrl) {
        await supabase.from("product_images").insert({
          product_id: newProduct.id,
          url: imageUrl,
          sort_order: 0
        })
      }
    }

    await fetchProducts()
  }

  const updateProduct = async (id: string, form: ProductFormData) => {
    // 1. Actualizar datos base del producto (volverá a estado "pending_approval" al editar, 
    // idealmente se debería hacer si cambias el título/descripción)
    const { error: updateError } = await supabase
      .from("products")
      .update({
        title: form.title.trim(),
        description: form.description.trim(),
        condition: form.condition,
        included_items: form.includedItems.trim(),
        price: Number(form.price),
        status: "pending_approval", // Si lo edita, pasa a revisión de nuevo
      })
      .eq("id", id)

    if (updateError) throw new Error("Error actualizando: " + updateError.message)

    // 2. Si seleccionó una NUEVA imagen, la subimos y reemplazamos
    if (form.imageFile) {
      const imageUrl = await uploadProductImage(id, form.imageFile)
      if (imageUrl) {
        // Borrar imágenes viejas en la BD para este producto
        await supabase.from("product_images").delete().eq("product_id", id)
        // Insertar la nueva
        await supabase.from("product_images").insert({
          product_id: id,
          url: imageUrl,
          sort_order: 0
        })
      }
    }

    await fetchProducts()
  }

  const deleteProduct = async (id: string) => {
    // Eliminar el producto. Como configuramos `ON DELETE CASCADE` en la base de datos, 
    // las filas en `product_images` y `favorites` relacionadas se borrarán solas.
    // NOTA: Para no complicarlo ahora, no borramos el archivo físico en Storage, 
    // pero idealmente podrías listarlo y borrarlo con supabase.storage.remove()
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) throw new Error("Error eliminando: " + error.message)

    await fetchProducts()
  }

  return {
    products,
    loading,
    refresh: fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}