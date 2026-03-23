export type ProductCondition = "new" | "like_new" | "good" | "fair" | "poor"

export type Product = {
  id: string
  title: string
  description: string
  condition: ProductCondition
  includedItems: string
  price: number
  imageUrl: string
}

export type ProductFormData = {
  title: string
  description: string
  condition: ProductCondition
  includedItems: string
  price: string
  imageFile: File | null
  imagePreviewUrl: string
}

export type ProductFormErrors = Partial<Record<"title" | "description" | "condition" | "price", string>>
