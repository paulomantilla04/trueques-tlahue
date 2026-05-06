"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Montserrat } from "next/font/google"
import {
  Button,
  Modal,
  Input,
  TextArea,
  Label,
  FieldError,
  TextField,
  Tabs,
} from "@heroui/react"
import { useCreateNegotiation } from "@/hooks/useCreateNegotiation"

const montserrat = Montserrat({ subsets: ["latin"] })

const schema = z
  .object({
    mode: z.enum(["price", "barter"]),
    proposedPrice: z.string().optional(),
    barterTitle: z.string().optional(),
    barterDescription: z.string().max(1000).optional(),
    barterEstimatedValue: z.string().optional(),
    barterImage: z.instanceof(File).optional(),
    message: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      if (data.mode === "price") {
        const price = parseFloat(data.proposedPrice || "")
        return !Number.isNaN(price) && price > 0
      }
      return true
    },
    {
      message: "Ingresa un precio válido mayor a 0",
      path: ["proposedPrice"],
    }
  )
  .refine(
    (data) => {
      if (data.mode === "barter") {
        return data.barterTitle !== undefined && data.barterTitle.trim().length >= 2
      }
      return true
    },
    {
      message: "El título es obligatorio",
      path: ["barterTitle"],
    }
  )

type FormValues = z.infer<typeof schema>

interface CreateOfferModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    title: string
    price: number | null
  }
}

export function CreateOfferModal({ isOpen, onClose, product }: CreateOfferModalProps) {
  const router = useRouter()
  const { createOffer, loading } = useCreateNegotiation()
  const [activeTab, setActiveTab] = useState<"price" | "barter">("price")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mode: "price",
      proposedPrice: "",
      message: "",
    },
  })

  const handleTabChange = (key: React.Key) => {
    const mode = String(key) as "price" | "barter"
    setActiveTab(mode)
    reset({
      mode,
      proposedPrice: mode === "price" ? "" : undefined,
      barterTitle: mode === "barter" ? "" : undefined,
      barterDescription: mode === "barter" ? "" : undefined,
      barterEstimatedValue: mode === "barter" ? "" : undefined,
      barterImage: undefined,
      message: "",
    })
    setImagePreview(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue("barterImage", file, { shouldValidate: true })
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: FormValues) => {
    const offerId = await createOffer({
      productId: product.id,
      mode: data.mode,
      proposedPrice:
        data.mode === "price" ? parseFloat(data.proposedPrice || "0") : undefined,
      barterItem:
        data.mode === "barter"
          ? {
              title: data.barterTitle || "",
              description: data.barterDescription,
              estimatedValue: data.barterEstimatedValue
                ? parseFloat(data.barterEstimatedValue)
                : undefined,
              imageFile: data.barterImage,
            }
          : undefined,
      initialMessage: data.message,
    })

    if (offerId) {
      onClose()
      reset()
      setImagePreview(null)
      router.push(`/messages/${offerId}`)
    }
  }

  const submitForm = () => {
    handleSubmit(onSubmit)()
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className={`${montserrat.className} rounded-2xl max-w-lg w-full`}>
            <Modal.Header>
              <Modal.Heading className="text-black font-bold text-center text-xl">
                Hacer oferta por &ldquo;{product.title}&rdquo;
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={handleTabChange}
                className="w-full"
              >
                <Tabs.List>
                  <Tabs.Tab id="price">Negociar precio</Tabs.Tab>
                  <Tabs.Tab id="barter">Ofrecer artículo</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel id="price">
                  <div className="space-y-4 mt-4">
                    <TextField isInvalid={Boolean(errors.proposedPrice)}>
                      <Label className="text-black font-semibold">
                        Precio que ofreces (MXN)
                      </Label>
                      <Input
                        type="number"
                        min={0.01}
                        step="0.01"
                        placeholder="0.00"
                        {...register("proposedPrice")}
                      />
                      <FieldError>{errors.proposedPrice?.message}</FieldError>
                    </TextField>

                    <TextField>
                      <Label className="text-black font-semibold">Mensaje opcional</Label>
                      <TextArea
                        rows={3}
                        placeholder="¿Algo que quieras decirle al vendedor?"
                        {...register("message")}
                      />
                    </TextField>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel id="barter">
                  <div className="space-y-4 mt-4">
                    <TextField isInvalid={Boolean(errors.barterTitle)}>
                      <Label className="text-black font-semibold">Título del artículo</Label>
                      <Input
                        placeholder="Ej. Bicicleta rodada 26"
                        {...register("barterTitle")}
                      />
                      <FieldError>{errors.barterTitle?.message}</FieldError>
                    </TextField>

                    <TextField>
                      <Label className="text-black font-semibold">Descripción</Label>
                      <TextArea
                        rows={3}
                        placeholder="Describe el estado y detalles del artículo"
                        {...register("barterDescription")}
                      />
                    </TextField>

                    <TextField>
                      <Label className="text-black font-semibold">Valor estimado (MXN)</Label>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        {...register("barterEstimatedValue")}
                      />
                    </TextField>

                    <div className="flex flex-col gap-2">
                      <Label className="text-black font-semibold">Foto del artículo</Label>
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-orange-50 file:text-orange-700
                          hover:file:bg-orange-100"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <div className="relative w-full h-32 rounded-xl overflow-hidden mt-2">
                          <img
                            src={imagePreview}
                            alt="Vista previa"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <TextField>
                      <Label className="text-black font-semibold">Mensaje opcional</Label>
                      <TextArea
                        rows={2}
                        placeholder="¿Algo que quieras decirle al vendedor?"
                        {...register("message")}
                      />
                    </TextField>
                  </div>
                </Tabs.Panel>
              </Tabs>
            </Modal.Body>

            <Modal.Footer className="flex justify-end gap-3">
              <Button
                className="bg-slate-200 text-black font-semibold rounded-xl"
                onPress={() => {
                  onClose()
                  reset()
                  setImagePreview(null)
                }}
              >
                Cancelar
              </Button>
              <Button
                className="bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-semibold"
                isDisabled={loading}
                onPress={submitForm}
              >
                {loading ? "Enviando..." : "Enviar oferta"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
