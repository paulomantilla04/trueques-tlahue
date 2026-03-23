"use client"

import { Montserrat } from "next/font/google"
import { type Key } from "react"
import {
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Select,
  TextArea,
  TextField,
} from "@heroui/react"
import { CONDITION_OPTIONS } from "@/components/dashboard/constants"
import type { ProductCondition, ProductFormData, ProductFormErrors } from "@/components/dashboard/types"

const montserrat = Montserrat({ subsets: ["latin"] })

export function ProductFormFields({
  form,
  errors,
  onInputChange,
  onConditionChange,
  onFileChange,
}: {
  form: ProductFormData
  errors: ProductFormErrors
  onInputChange: (field: keyof ProductFormData, value: string) => void
  onConditionChange: (value: ProductCondition) => void
  onFileChange: (file: File | null) => void
}) {
  return (
    <>
      <TextField isInvalid={errors.title !== undefined} className={`${montserrat.className}`}>
        <Label className='text-black font-semibold'>Título</Label>
        <Input
          value={form.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="Ej. Bicicleta"
        />
        <FieldError>{errors.title}</FieldError>
      </TextField>
      
      <TextField isInvalid={errors.description !== undefined} className={`${montserrat.className}`}>
        <Label className='text-black font-semibold'>Descripción</Label>
        <TextArea
          value={form.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Describe el estado, uso y detalles"
          rows={3}
        />
        <FieldError>{errors.description}</FieldError>
      </TextField>

      <Select
        selectedKey={form.condition}
        onSelectionChange={(key: Key | null) => {
          if (key !== null) onConditionChange(String(key) as ProductCondition)
        }}
        className={`${montserrat.className}`}
      >
        <Label className='text-black font-semibold'>Condición</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox items={CONDITION_OPTIONS}>
            {(item) => (
              <ListBoxItem id={item.value} textValue={item.label} className={`text-black ${montserrat.className}`}>
                {item.label}
              </ListBoxItem>
            )}
          </ListBox>
        </Select.Popover>
      </Select>
      {errors.condition !== undefined && (
        <p className="text-sm text-rose-600">{errors.condition}</p>
      )}

      <TextField className={`${montserrat.className}`}>
        <Label className='text-black font-semibold'>Items incluidos</Label>
        <TextArea
          value={form.includedItems}
          onChange={(e) => onInputChange("includedItems", e.target.value)}
          placeholder="Ej. Cargador, funda, manual"
          rows={2}
        />
      </TextField>

      <TextField isInvalid={errors.price !== undefined} className={`${montserrat.className}`}>
        <Label className='text-black font-semibold'>Precio (MXN)</Label>
        <Input
          value={form.price}
          onChange={(e) => onInputChange("price", e.target.value)}
          placeholder="0.00"
          type="number"
          min={0}
          step="0.01"
        />
        <FieldError>{errors.price}</FieldError>
      </TextField>

      <TextField className={`${montserrat.className}`}>
        <Label className='text-black font-semibold'>Imagen</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null
            onFileChange(file)
          }}
        />
      </TextField>
    </>
  )
}
