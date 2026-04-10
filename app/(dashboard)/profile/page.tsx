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

type Msg = { type: "success" | "error"; text: string } | null;

function InlineMessage({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <div
      className={`mt-4 rounded-lg px-4 py-3 text-sm ${
        msg.type === "error"
          ? "bg-rose-100 text-rose-600"
          : "bg-emerald-100 text-emerald-600"
      }`}
    >
      {msg.text}
    </div>
  );
}

export default function ProfilePage() {
  const supabase = createClient();
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading } = useProfile();

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Mensajes independientes por card
  const [profileMsg, setProfileMsg] = useState<Msg>(null);
  const [passwordMsg, setPasswordMsg] = useState<Msg>(null);

  const [passwordValue, setPasswordValue] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showProfileMsg = (type: "success" | "error", text: string) => {
    setProfileMsg({ type, text });
    setTimeout(() => setProfileMsg(null), 4000);
  };

  const showPasswordMsg = (type: "success" | "error", text: string) => {
    setPasswordMsg({ type, text });
    setTimeout(() => setPasswordMsg(null), 4000);
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!profile?.id) return null;
    const fileExt = file.name.split(".").pop();
    const filePath = `${profile.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Error subiendo avatar:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile?.id) return;

    setIsUpdatingProfile(true);

    const formData = new FormData(e.currentTarget);
    const typedName = formData.get("display_name")?.toString().trim() ?? "";

    // Validar nombre solo si el usuario escribió algo diferente al actual
    if (typedName.length > 0 && typedName.length < 2) {
      showProfileMsg("error", "El nombre debe tener al menos 2 caracteres.");
      setIsUpdatingProfile(false);
      return;
    }
    if (typedName.length > 60) {
      showProfileMsg("error", "El nombre no puede exceder los 60 caracteres.");
      setIsUpdatingProfile(false);
      return;
    }

    // Si dejó el campo vacío, conservar el nombre actual
    const displayName = typedName.length > 0 ? typedName : profile.display_name;
    const avatarFile = fileInputRef.current?.files?.[0] ?? null;

    // Subir avatar si hay uno nuevo
    let avatarUrl: string | undefined;
    if (avatarFile) {
      const url = await uploadAvatar(avatarFile);
      if (!url) {
        showProfileMsg("error", "No se pudo subir la foto de perfil.");
        setIsUpdatingProfile(false);
        return;
      }
      avatarUrl = url;
    }

    const updatePayload: { display_name: string; avatar_url?: string } = {
      display_name: displayName,
    };
    if (avatarUrl) updatePayload.avatar_url = avatarUrl;

    const { error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", profile.id);

    if (error) {
      showProfileMsg("error", "Error al actualizar el perfil.");
    } else {
      showProfileMsg("success", "Perfil actualizado correctamente.");
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }

    setIsUpdatingProfile(false);
  };

  const onUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const password = formData.get("password")?.toString() || "";

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      showPasswordMsg("error", "Error al actualizar la contraseña. Intenta de nuevo.");
    } else {
      showPasswordMsg("success", "¡Contraseña actualizada con éxito!");
      formEl.reset();
      setPasswordValue("");
    }

    setIsUpdatingPassword(false);
  };

  if (userLoading || profileLoading) {
    return (
      <div className="p-8 text-center text-slate-500">Cargando perfil...</div>
    );
  }

  const currentAvatar =
    avatarPreview ?? profile?.avatar_url ?? "/placeholder-avatar.png";

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Mi Perfil</h1>

      {/* Card — Información pública */}
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

              {/* Nombre — opcional, se conserva el actual si se deja vacío */}
              <TextField name="display_name">
                <Label>Nombre a mostrar</Label>
                <Input
                  placeholder="Tu nombre"
                  variant="secondary"
                />
                <Description className="text-xs text-slate-400">
                  Déjalo igual si no quieres cambiarlo.
                </Description>
                <FieldError className="text-rose-600 text-xs" />
              </TextField>

              {/* Foto de perfil */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Foto de Perfil</Label>
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
                      if (file) setAvatarPreview(URL.createObjectURL(file));
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  JPG, PNG o WEBP. Se reemplazará la foto actual.
                </p>
              </div>
            </FieldGroup>

            {/* Mensaje de esta card */}
            <InlineMessage msg={profileMsg} />

            <Fieldset.Actions className="mt-4">
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

      {/* Card — Seguridad */}
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

            {/* Mensaje de esta card */}
            <InlineMessage msg={passwordMsg} />

            <Fieldset.Actions className="mt-4">
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