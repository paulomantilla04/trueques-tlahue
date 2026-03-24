
export type ProductCondition = "new" | "like_new" | "good" | "fair" | "poor"

export type ProductStatus = "active" | "reserved" | "sold" | "pending_approval" | "rejected"

export type Product = {
  id: string
  categoryId: string // <-- Nuevo campo
  title: string
  description: string
  condition: ProductCondition
  status: ProductStatus
  includedItems: string
  price: number
  imageUrl: string
}

export type ProductFormData = {
  categoryId: string // <-- Nuevo campo
  title: string
  description: string
  condition: ProductCondition
  includedItems: string
  price: string
  imageFile: File | null
  imagePreviewUrl: string
}

export type ProductFormErrors = Partial<Record<"categoryId" | "title" | "description" | "condition" | "price", string>>