"use client"

import { useState, type FormEvent } from "react"
import { useOverlayState } from "@heroui/react"
import { ProductCard } from "@/components/dashboard/product-card"
import { CreateProductModal } from "@/components/dashboard/create-product-modal"
import { EditProductModal } from "@/components/dashboard/edit-product-modal"
import { DeleteProductModal } from "@/components/dashboard/delete-product-modal"
import type { Product, ProductFormData, ProductFormErrors } from "@/components/dashboard/types"
import { useProfile } from "@/hooks/useProfile"
import { useUserProducts } from "@/hooks/useUserProducts"

const emptyForm = (): ProductFormData => ({
  title: "",
  description: "",
  condition: "good",
  includedItems: "",
  price: "",
  imageFile: null,
  imagePreviewUrl: "",
})

function validateProductForm(form: ProductFormData): ProductFormErrors {
  const errors: ProductFormErrors = {}

  if (form.title.trim().length === 0) errors.title = "El título es obligatorio."
  if (form.description.trim().length === 0) errors.description = "La descripción es obligatoria."
  if (form.condition.trim().length === 0) errors.condition = "Selecciona una condición."

  const priceValue = Number(form.price)
  if (form.price.trim().length === 0) {
    errors.price = "El precio es obligatorio."
  } else if (!Number.isFinite(priceValue) || priceValue <= 0) {
    errors.price = "Ingresa un precio válido mayor a 0."
  }

  return errors
}

function productToForm(product: Product): ProductFormData {
  return {
    title: product.title,
    description: product.description,
    condition: product.condition,
    includedItems: product.includedItems,
    price: String(product.price),
    imageFile: null,
    imagePreviewUrl: product.imageUrl,
  }
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
        <svg className="h-7 w-7 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <p className="text-base font-medium text-slate-700">Aún no tienes productos</p>
      <p className="mt-1 text-sm text-slate-400">Agrega tu primer producto para empezar a vender.</p>
      <button
        onClick={onAdd}
        className="mt-6 rounded-full bg-orange-500 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
      >
        Agregar producto
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const { profile } = useProfile()
  const { products, loading, addProduct, updateProduct, deleteProduct } = useUserProducts()

  const createModal = useOverlayState()
  const editModal = useOverlayState()
  const deleteModal = useOverlayState()

  const [createForm, setCreateForm] = useState<ProductFormData>(emptyForm)
  const [editForm, setEditForm] = useState<ProductFormData>(emptyForm)
  const [createErrors, setCreateErrors] = useState<ProductFormErrors>({})
  const [editErrors, setEditErrors] = useState<ProductFormErrors>({})
  const [savingCreate, setSavingCreate] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const openCreateModal = () => {
    setCreateForm(emptyForm())
    setCreateErrors({})
    createModal.open()
  }

  const openEditModal = (product: Product) => {
    setSelectedProduct(product)
    setEditForm(productToForm(product))
    setEditErrors({})
    editModal.open()
  }

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product)
    deleteModal.open()
  }

  const handleCreateSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const errors = validateProductForm(createForm)
    setCreateErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSavingCreate(true)
    await addProduct(createForm)
    setSavingCreate(false)
    createModal.close()
  }

  const handleEditSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    if (!selectedProduct) return

    const errors = validateProductForm(editForm)
    setEditErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSavingEdit(true)
    await updateProduct(selectedProduct.id, editForm)
    setSavingEdit(false)
    editModal.close()
  }

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return
    setDeleting(true)
    await deleteProduct(selectedProduct.id)
    setDeleting(false)
    deleteModal.close()
  }

  const handleCreateFieldChange = (field: keyof ProductFormData, value: string) =>
    setCreateForm((prev) => ({ ...prev, [field]: value }))

  const handleEditFieldChange = (field: keyof ProductFormData, value: string) =>
    setEditForm((prev) => ({ ...prev, [field]: value }))

  const createImageChange = (file: File | null) => {
    const preview = file ? URL.createObjectURL(file) : ""
    setCreateForm((prev) => ({ ...prev, imageFile: file, imagePreviewUrl: preview }))
  }

  const editImageChange = (file: File | null) => {
    const preview = file ? URL.createObjectURL(file) : editForm.imagePreviewUrl
    setEditForm((prev) => ({ ...prev, imageFile: file, imagePreviewUrl: preview }))
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Hola, <span className="text-orange-500">{profile?.display_name || "Usuario"}</span>!
            </h1>
            <p className="mt-1 text-slate-500">Aquí podrás gestionar tus productos.</p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nuevo producto
          </button>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="animate-pulse text-slate-500">Cargando tus productos...</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.length === 0 ? (
              <EmptyState onAdd={openCreateModal} />
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Modals continúan igual... */}
      <CreateProductModal
        modalState={createModal}
        form={createForm}
        errors={createErrors}
        saving={savingCreate}
        onSubmit={() => void handleCreateSubmit()}
        onInputChange={handleCreateFieldChange}
        onConditionChange={(v) => handleCreateFieldChange("condition", v)}
        onFileChange={createImageChange}
      />

      <EditProductModal
        modalState={editModal}
        form={editForm}
        errors={editErrors}
        saving={savingEdit}
        onSubmit={() => void handleEditSubmit()}
        onInputChange={handleEditFieldChange}
        onConditionChange={(v) => handleEditFieldChange("condition", v)}
        onFileChange={editImageChange}
      />

      <DeleteProductModal
        modalState={deleteModal}
        product={selectedProduct}
        deleting={deleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}