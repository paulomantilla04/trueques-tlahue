type ProductLike = {
  title: string
  description?: string | null
  price?: number | null
  condition?: string | null
  seller_id?: string | null
  category_id?: string | null
  categoryId?: string | null
}

function normalizeValue(value?: string | null) {
  return value?.trim().toLowerCase().replace(/\s+/g, " ") ?? ""
}

export function dedupeProducts<T extends ProductLike>(products: T[]) {
  const seen = new Set<string>()

  return products.filter((product) => {
    const fingerprint = [
      normalizeValue(product.title),
      normalizeValue(product.description),
      String(product.price ?? ""),
      normalizeValue(product.condition),
      normalizeValue(product.seller_id),
      normalizeValue(product.category_id ?? product.categoryId),
    ].join("|")

    if (seen.has(fingerprint)) return false

    seen.add(fingerprint)
    return true
  })
}

export function getProductImageUrl(title: string, imageUrl?: string | null) {
  if (imageUrl?.trim()) return imageUrl

  const normalizedTitle = normalizeValue(title)

  if (normalizedTitle.includes("macbook pro m3")) {
    return "/macbook-pro-m3-fallback.svg"
  }

  return "/placeholder-image.jpg"
}
