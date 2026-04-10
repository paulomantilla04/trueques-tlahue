"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import { useProfile } from "@/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";
import {
  Form,
  Fieldset,
  FieldGroup,
  TextField,
  Label,
  Input,
  FieldError,
  Description,
  Button,
  Card,
} from "@heroui/react";

export default function ProfilePage() {
  const supabase = createClient();
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading } = useProfile();

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordValue, setPasswordValue] = useState("");

  // Para la preview del avatar antes de subir
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Muestra el mensaje y lo limpia solo después de 4 segundos
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!profile?.id) return null;

    const fileExt = file.name.split(".").pop();
    const filePath = `${profile.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars") // asegúrate de tener este bucket en Supabase
      .upload(filePath, file, { upsert: true }); // upsert: reemplaza si ya existe

    if (uploadError) {
      console.error("Error subiendo avatar:", uploadError);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return publicUrl;
  };

  const onUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile?.id) return;

    setIsUpdatingProfile(true);

    const formData = new FormData(e.currentTarget);
    const displayName = formData.get("display_name")?.toString().trim() || "";
    const avatarFile = fileInputRef.current?.files?.[0] ?? null;

    // 1. Si hay imagen nueva, subirla primero
    let avatarUrl: string | undefined;
    if (avatarFile) {
      const url = await uploadAvatar(avatarFile);
      if (!url) {
        showMessage("error", "No se pudo subir la foto de perfil.");
        setIsUpdatingProfile(false);
        return;
      }
      avatarUrl = url;
    }

    // 2. Actualizar el perfil en la BD
    const updatePayload: { display_name: string; avatar_url?: string } = {
      display_name: displayName,
    };
    if (avatarUrl) updatePayload.avatar_url = avatarUrl;

    const { error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", profile.id);

    if (error) {
      showMessage("error", "Error al actualizar el perfil.");
    } else {
      showMessage("success", "Perfil actualizado correctamente.");
      // Limpiar la preview y el input de archivo
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

    setIsUpdatingProfile(false);
  };

  const onUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password")?.toString() || "";

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      showMessage("error", "Error al actualizar la contraseña.");
    } else {
      showMessage("success", "Contraseña actualizada con éxito.");
      (e.target as HTMLFormElement).reset();
      setPasswordValue("");
    }

    setIsUpdatingPassword(false);
  };

  if (userLoading || profileLoading) {
    return (
      <div className="p-8 text-center text-slate-500">Cargando perfil...</div>
    );
  }

  // Avatar a mostrar: preview local > avatar_url de BD > placeholder
  const currentAvatar =
    avatarPreview ?? profile?.avatar_url ?? "/placeholder-avatar.png";

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Mi Perfil</h1>

      {message && (
        <div
          className={`p-4 rounded-lg text-sm transition-all ${
            message.type === "error"
              ? "bg-rose-100 text-rose-600"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Información pública */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <Form className="w-full" onSubmit={onUpdateProfile}>
          <Fieldset className="w-full">
            <Fieldset.Legend className="text-lg font-semibold text-slate-700 mb-1">
              Información Pública
            </Fieldset.Legend>
            <Description className="mb-5 text-sm text-slate-500">
              Esta información será visible para otros usuarios al negociar trueques.
            </Description>

            <FieldGroup className="w-full space-y-4">
              {/* Email (solo lectura) */}
              <TextField name="email">
                <Label>Correo Electrónico</Label>
                <Input
                  disabled
                  value={user?.email ?? "Correo no disponible"}
                  variant="secondary"
                />
                <Description>El correo electrónico no se puede cambiar.</Description>
              </TextField>

              {/* Nombre — con defaultValue del perfil actual */}
              <TextField
                isRequired
                name="display_name"
                validate={(value) => {
                  if (value.trim().length < 2)
                    return "El nombre debe tener al menos 2 caracteres.";
                  if (value.trim().length > 60)
                    return "El nombre no puede exceder los 60 caracteres.";
                  return null;
                }}
              >
                <Label>Nombre a mostrar</Label>
                <Input
                  placeholder="Tu nombre"
                  variant="secondary"
                />
                <FieldError className="text-rose-600 text-xs" />
              </TextField>

              {/* Foto de perfil */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Foto de Perfil</Label>

                {/* Preview del avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0">
                    <Image
                      src={currentAvatar}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-orange-50 file:text-orange-700
                      hover:file:bg-orange-100"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  JPG, PNG o WEBP. Se reemplazará la foto actual.
                </p>
              </div>
            </FieldGroup>

            <Fieldset.Actions className="mt-6">
              <Button
                type="submit"
                className="bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600"
                isPending={isUpdatingProfile}
              >
                Guardar Cambios
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
      </Card>

      {/* Seguridad */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <Form className="w-full" onSubmit={onUpdatePassword}>
          <Fieldset className="w-full">
            <Fieldset.Legend className="text-lg font-semibold text-slate-700 mb-4">
              Seguridad
            </Fieldset.Legend>

            <FieldGroup className="w-full space-y-4">
              <TextField
                isRequired
                name="password"
                validate={(value) => {
                  if (value.length < 6)
                    return "La contraseña debe tener al menos 6 caracteres.";
                  return null;
                }}
              >
                <Label>Nueva Contraseña</Label>
                <Input
                  type="password"
                  variant="secondary"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
                <FieldError className="text-rose-600 text-xs" />
              </TextField>

              <TextField
                isRequired
                name="confirmPassword"
                validate={(value) => {
                  if (value !== passwordValue)
                    return "Las contraseñas no coinciden.";
                  return null;
                }}
              >
                <Label>Confirmar Contraseña</Label>
                <Input type="password" variant="secondary" />
                <FieldError className="text-rose-600 text-xs" />
              </TextField>
            </FieldGroup>

            <Fieldset.Actions className="mt-6">
              <Button
                type="submit"
                className="bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900"
                isPending={isUpdatingPassword}
              >
                Actualizar Contraseña
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
      </Card>
    </div>
  );
}