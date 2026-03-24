"use client";

import { Montserrat } from "next/font/google";
import { type Key } from "react";
import {
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import { CONDITION_OPTIONS } from "@/components/dashboard/constants";
import type {
  ProductCondition,
  ProductFormData,
  ProductFormErrors,
} from "@/components/dashboard/types";
import { useCategories } from "@/hooks/useCategories"; // <-- IMPORTAMOS EL HOOK

const montserrat = Montserrat({ subsets: ["latin"] });

export function ProductFormFields({
  form,
  errors,
  onInputChange,
  onConditionChange,
  onFileChange,
}: {
  form: ProductFormData;
  errors: ProductFormErrors;
  onInputChange: (field: keyof ProductFormData, value: string) => void;
  onConditionChange: (value: ProductCondition) => void;
  onFileChange: (file: File | null) => void;
}) {
  const { categories, loading } = useCategories(); // <-- TRAEMOS LAS CATEGORÍAS

  return (
    <>
      <TextField
        isInvalid={errors.title !== undefined}
        className={`${montserrat.className}`}
      >
        <Label className="text-black font-semibold">Título</Label>
        <Input
          value={form.title}
          onChange={(e) => onInputChange("title", e.target.value)}
          placeholder="Ej. Bicicleta"
        />
        <FieldError>{errors.title}</FieldError>
      </TextField>

      <TextField
        isInvalid={errors.description !== undefined}
        className={`${montserrat.className}`}
      >
        <Label className="text-black font-semibold">Descripción</Label>
        <TextArea
          value={form.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Describe el estado, uso y detalles"
          rows={3}
        />
        <FieldError>{errors.description}</FieldError>
      </TextField>

      {/* --- NUEVO SELECTOR DE CATEGORÍA --- */}
      <div className="flex flex-col">
        <Select
          selectedKey={form.categoryId || null}
          onSelectionChange={(key: Key | null) => {
            if (key !== null) onInputChange("categoryId", String(key));
          }}
          className={`${montserrat.className}`}
          isDisabled={loading}
        >
          <Label className="text-black font-semibold">
            Categoría{" "}
            {loading && (
              <span className="text-slate-400 font-normal">(Cargando...)</span>
            )}
          </Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox items={categories}>
              {(item) => (
                <ListBoxItem
                  id={item.id}
                  textValue={item.name}
                  className={`text-black ${montserrat.className}`}
                >
                  {item.name}
                </ListBoxItem>
              )}
            </ListBox>
          </Select.Popover>
        </Select>
        {errors.categoryId !== undefined && (
          <p className={`text-sm text-rose-600 mt-1 ${montserrat.className}`}>
            {errors.categoryId}
          </p>
        )}
      </div>
      {/* ----------------------------------- */}

      <Select
        selectedKey={form.condition}
        onSelectionChange={(key: Key | null) => {
          if (key !== null) onConditionChange(String(key) as ProductCondition);
        }}
        className={`${montserrat.className}`}
      >
        <Label className="text-black font-semibold">Condición</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox items={CONDITION_OPTIONS}>
            {(item) => (
              <ListBoxItem
                id={item.value}
                textValue={item.label}
                className={`text-black ${montserrat.className}`}
              >
                {item.label}
              </ListBoxItem>
            )}
          </ListBox>
        </Select.Popover>
      </Select>
      {errors.condition !== undefined && (
        <p className={`text-sm text-rose-600 ${montserrat.className}`}>
          {errors.condition}
        </p>
      )}

      <TextField className={`${montserrat.className}`}>
        <Label className="text-black font-semibold">Items incluidos</Label>
        <TextArea
          value={form.includedItems}
          onChange={(e) => onInputChange("includedItems", e.target.value)}
          placeholder="Ej. Cargador, funda, manual"
          rows={2}
        />
      </TextField>

      <TextField
        isInvalid={errors.price !== undefined}
        className={`${montserrat.className}`}
      >
        <Label className="text-black font-semibold">Precio (MXN)</Label>
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

      <div className="flex flex-col gap-2">
        <Label className={`text-black font-semibold ${montserrat.className}`}>
          Imagen
        </Label>
        <input
          type="file"
          accept="image/*"
          className={`block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700
                  hover:file:bg-orange-100 ${montserrat.className}`}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            onFileChange(file);
          }}
        />
      </div>
    </>
  );
}
