"use client"

import { Montserrat } from "next/font/google"
import { Button, Form, Modal, type UseOverlayStateReturn } from "@heroui/react"
import { ProductFormFields } from "@/components/dashboard/product-form-fields"
import type { ProductCondition, ProductFormData, ProductFormErrors } from "@/components/dashboard/types"

const montserrat = Montserrat({ subsets: ["latin"] })

export function CreateProductModal({
  modalState,
  form,
  errors,
  saving,
  onSubmit,
  onInputChange,
  onConditionChange,
  onFileChange,
}: {
  modalState: UseOverlayStateReturn
  form: ProductFormData
  errors: ProductFormErrors
  saving: boolean
  onSubmit: () => void
  onInputChange: (field: keyof ProductFormData, value: string) => void
  onConditionChange: (value: ProductCondition) => void
  onFileChange: (file: File | null) => void
}) {
  return (
    <Modal isOpen={modalState.isOpen} onOpenChange={modalState.setOpen}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading className={`${montserrat.className} text-black font-bold text-center`}>Nuevo producto</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Form className="space-y-4" onSubmit={(event) => {
                event.preventDefault()
                onSubmit()
              }}>
                <ProductFormFields
                  form={form}
                  errors={errors}
                  onInputChange={onInputChange}
                  onConditionChange={onConditionChange}
                  onFileChange={onFileChange}
                />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button className={`${montserrat.className} text-black font-semibold bg-slate-200 rounded-xl`} onPress={modalState.close}>
                Cancelar
              </Button>
              <Button
                className={`bg-orange-500 text-white hover:bg-orange-600 rounded-xl ${montserrat.className}`}
                isDisabled={saving}
                onPress={onSubmit}
              >
                {saving ? "Guardando..." : "Crear producto"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
