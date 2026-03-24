import type { ProductCondition } from "@/components/dashboard/types"

export const CONDITION_OPTIONS: { value: ProductCondition; label: string }[] = [
  { value: "new", label: "Nuevo" },
  { value: "like_new", label: "Como nuevo" },
  { value: "good", label: "Bueno" },
  { value: "fair", label: "Regular" },
  { value: "poor", label: "Usado" },
]

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  new: "Nuevo",
  like_new: "Como nuevo",
  good: "Bueno",
  fair: "Regular",
  poor: "Usado",
}
