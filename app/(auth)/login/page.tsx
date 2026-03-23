"use client"

import { useMemo, useState, type FormEvent } from "react"
import Image from "next/image"
import { z } from "zod"
import { Button, Card, FieldError, Form, Input, Label, Link, TextField } from "@heroui/react"
import { createClient } from "@/lib/supabase/client"
import { Montserrat } from "next/font/google"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  email: z.string().trim().min(1, "El email es obligatorio.").email("Ingresa un email válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
})

type FormValues = {
  email: string
  password: string
}

type FormErrors = Partial<Record<keyof FormValues | "form", string>>

const initialValues: FormValues = {
  email: "",
  password: "",
}

function validate(values: FormValues): FormErrors {
  const parsed = loginSchema.safeParse(values)

  if (parsed.success) return {}

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

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [values, setValues] = useState<FormValues>(initialValues)
  const [showErrors, setShowErrors] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const validationErrors = useMemo(() => validate(values), [values])
  const visibleErrors = useMemo(
    () => (showErrors ? validationErrors : {}),
    [showErrors, validationErrors]
  )

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setFormError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setShowErrors(true)
    setFormError(null)

    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password,
    })

    if (error) {
      setFormError("Email o contraseña incorrectos. Intenta de nuevo.")
      setLoading(false)
      return
    }

    router.refresh()
    router.push("/dashboard")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <Card
        className={`w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_-30px_rgba(15,23,42,0.45)] ${montserrat.className}`}
        variant="default"
      >
        <Card.Header className="flex flex-col items-center gap-4 pb-3 pt-8">
          <Image alt="Trueques Tlahue" height={100} priority src="/trueques-logo.svg" width={200} />
        </Card.Header>

        <Card.Content className="px-6 pb-7 sm:px-8">
          <Form className="space-y-4" onSubmit={handleSubmit}>
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
                autoComplete="current-password"
                onChange={(e) => handleFieldChange("password", e.target.value)}
                placeholder="Tu contraseña"
                type="password"
                value={values.password}
              />
              <FieldError>{visibleErrors.password}</FieldError>
            </TextField>

            {formError ? (
              <p className="text-sm text-rose-600 bg-rose-100 p-3 rounded-lg">{formError}</p>
            ) : null}

            <Button
              className="w-full bg-orange-500 text-white hover:bg-orange-600 rounded-lg"
              isDisabled={loading}
              type="submit"
              variant="primary"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </Form>

          <p className="mt-5 text-center text-sm text-slate-600">
            ¿No tienes una cuenta?{" "}
            <Link className="font-medium text-slate-900" href="/signup">
              Regístrate
            </Link>
          </p>
        </Card.Content>
      </Card>
    </main>
  )
}