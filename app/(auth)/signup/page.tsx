"use client"

import { useMemo, useState, type FormEvent } from "react"
import Image from "next/image"
import { z } from "zod"
import { Button, Card, FieldError, Form, Input, Label, Link, TextField } from "@heroui/react"
import { createClient } from "@/lib/supabase/client"
import { Montserrat } from "next/font/google"

const MIN_PASSWORD_LENGTH = 8

const signupSchema = z
  .object({
    name: z.string().trim().min(1, "El nombre es obligatorio."),
    email: z.string().trim().min(1, "El email es obligatorio.").email("Ingresa un email valido."),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, "La contraseña debe tener al menos " + MIN_PASSWORD_LENGTH + " caracteres."),
    confirmPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })

type FormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type FormErrors = Partial<Record<keyof FormValues | "form", string>>

const initialValues: FormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
}

function validate(values: FormValues): FormErrors {
  const parsed = signupSchema.safeParse(values)

  if (parsed.success) {
    return {}
  }

  const nextErrors: FormErrors = {}

  for (const issue of parsed.error.issues) {
    const path = issue.path[0]

    if (typeof path === "string" && !(path in nextErrors)) {
      nextErrors[path as keyof FormValues] = issue.message
    }
  }

  return nextErrors
}

const montserrat = Montserrat({ subsets: ["latin"] })


export default function SignupPage() {
  const supabase = createClient()
  const [values, setValues] = useState<FormValues>(initialValues)
  const [showErrors, setShowErrors] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const validationErrors = useMemo(() => validate(values), [values])
  const visibleErrors = useMemo(
     () => (showErrors ? validationErrors : {}),
     [showErrors, validationErrors]
   )

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setFormError(null)
    setSuccessMessage(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowErrors(true)
    setFormError(null)
    setSuccessMessage(null)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        data: {
          display_name: values.name.trim(),
        },
      },
    })

    if (error) {
      setFormError(error.message)
      console.error(error)
      setLoading(false)
      return
    }
    
    setValues(initialValues)
    setShowErrors(false)
    setLoading(false)
    setSuccessMessage("Cuenta creada. Inicia sesión para continuar.")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <Card
        className={`w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] ${montserrat.className}`}
        variant="default"
      >
        <Card.Header className="flex flex-col items-center gap-4 pb-3 pt-8">
          <Image alt="Trueques Tlahue" height={100} priority src="/trueques-logo.svg" width={200}/>
        </Card.Header>

        <Card.Content className="px-6 pb-7 sm:px-8">
          <Form className="space-y-4" onSubmit={handleSubmit}>
            <TextField isInvalid={Boolean(visibleErrors.name)}>
              <Label className="text-black">Nombre</Label>
              <Input
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="Tu nombre"
                type="text"
                value={values.name}
              />
              <FieldError>{visibleErrors.name}</FieldError>
            </TextField>

            <TextField isInvalid={Boolean(visibleErrors.email)}>
              <Label className="text-black">Email</Label>
              <Input
                autoComplete="email"
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="correo@ejemplo.com"
                type="email"
                value={values.email}
              />
              <FieldError>{visibleErrors.email}</FieldError>
            </TextField>

            <TextField isInvalid={Boolean(visibleErrors.password)}>
              <Label className="text-black">Contraseña</Label>
              <Input
                autoComplete="new-password"
                onChange={(e) => handleFieldChange("password", e.target.value)}
                placeholder="Minimo 8 caracteres"
                type="password"
                value={values.password}
              />
              <FieldError>{visibleErrors.password}</FieldError>
            </TextField>

            <TextField isInvalid={Boolean(visibleErrors.confirmPassword)}>
              <Label className="text-black">Confirmar contraseña</Label>
              <Input
                autoComplete="new-password"
                onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
                placeholder="Repite tu contraseña"
                type="password"
                value={values.confirmPassword}
              />
              <FieldError>{visibleErrors.confirmPassword}</FieldError>
            </TextField>

            {formError ? <p className="text-sm text-rose-600 bg-rose-100 p-3 rounded-lg">{formError}</p> : null}
            {successMessage ? <p className="text-sm text-emerald-600 bg-emerald-100 p-2 rounded-lg">{successMessage}</p> : null}

            <Button
              className="w-full bg-orange-500 text-white hover:bg-orange-600 rounded-lg"
              isDisabled={loading}
              type="submit"
              variant="primary"
            >
              {loading ? "Registrando..." : "Regístrate"}
            </Button>
          </Form>

          <p className="mt-5 text-center text-sm text-slate-600">
            ¿Ya tienes una cuenta?{" "}
            <Link className="font-medium text-slate-900" href="/login">
              Inicia sesión
            </Link>
          </p>
        </Card.Content>
      </Card>
    </main>
  )
}
