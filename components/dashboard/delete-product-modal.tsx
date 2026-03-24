"use client"

import { Montserrat } from "next/font/google"
import { Button, Modal, type UseOverlayStateReturn } from "@heroui/react"
import type { Product } from "@/components/dashboard/types"

const montserrat = Montserrat({ subsets: ["latin"] })

export function DeleteProductModal({
  modalState,
  product,
  deleting,
  onConfirm,
}: {
  modalState: UseOverlayStateReturn
  product: Product | null
  deleting: boolean
  onConfirm: () => void
}) {
  return (
    <Modal isOpen={modalState.isOpen} onOpenChange={modalState.setOpen}>
      <Modal.Backdrop>
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading className={`${montserrat.className} text-black font-semibold`}>Eliminar producto</Modal.Heading>
            </Modal.Header>
            <Modal.Body className={`${montserrat.className}`}>
              <p className="text-sm text-slate-600">
                ¿Seguro que quieres eliminar{" "}
                <span className="font-semibold text-slate-900">
                  {product?.title ?? "este producto"}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button className={`${montserrat.className} text-black font-semibold bg-slate-200 rounded-xl`} onPress={modalState.close}>
                Cancelar
              </Button>
              <Button variant="danger" className={`${montserrat.className} text-white rounded-xl`} isDisabled={deleting} onPress={onConfirm}>
                {deleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
