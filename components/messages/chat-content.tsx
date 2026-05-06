"use client"

import { useState } from "react"
import Image from "next/image"
import { RiSendPlaneLine, RiArrowLeftLine, RiCheckLine, RiCloseLine, RiDeleteBinLine } from "react-icons/ri"
import { format } from "date-fns"

import { useMessages } from "@/hooks/useMessages"
import { useProfile } from "@/hooks/useProfile"
import { useOfferDetails } from "@/hooks/useOfferDetails"
import { useOfferActions } from "@/hooks/useOfferActions"
import { useCancelAcceptedOffer } from "@/hooks/useCancelAcceptedOffer"

import { InfoBox } from "./infoBox"

interface ChatContentProps {
  selectedChat: {
    id: string
    name: string
    avatar: string
    product: {
      title: string
      condition: string
      image: string
    }
  } | null
  onBack?: () => void
}

export function ChatContent({ selectedChat, onBack }: ChatContentProps) {
  const [newMessage, setNewMessage] = useState("")
  const { profile } = useProfile()

  const { messages, sendMessage, bottomRef } = useMessages(selectedChat?.id || "")
  const { offer, loading: offerLoading, isSeller, isBuyer } = useOfferDetails(selectedChat?.id || "")
  const { acceptOffer, rejectOffer, loading: actionLoading } = useOfferActions()
  const { cancelOffer, loading: cancelLoading } = useCancelAcceptedOffer()

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !profile?.id) return
    const text = newMessage
    setNewMessage("")
    await sendMessage(text, profile.id)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleAccept = async () => {
    if (!selectedChat) return
    const success = await acceptOffer(selectedChat.id)
    if (success) {
      // Send a system-like message
      if (profile?.id) {
        await sendMessage("✅ Oferta aceptada", profile.id)
      }
    }
  }

  const handleReject = async () => {
    if (!selectedChat) return
    const success = await rejectOffer(selectedChat.id)
    if (success) {
      if (profile?.id) {
        await sendMessage("❌ Oferta rechazada", profile.id)
      }
    }
  }

  const handleCancelAccepted = async () => {
    if (!selectedChat) return
    if (!confirm("¿Cancelar este trueque? El producto volverá a estar disponible para todos.")) return
    const success = await cancelOffer(selectedChat.id)
    if (success) {
      if (profile?.id) {
        await sendMessage("🚫 Trueque cancelado — producto disponible de nuevo", profile.id)
      }
    }
  }

  const canSendMessages = offer?.status === "pending" || offer?.status === "accepted" || offer?.status === "countered"
  const isPending = offer?.status === "pending"

  if (!selectedChat) {
    return (
      <main className="flex-1 p-4 bg-white">
        <div className="flex flex-col md:flex-row gap-4 h-[calc(100dvh-92px)]">
          <div className="flex-1 md:flex-[2] bg-[#d9e4c9] rounded-2xl flex items-center justify-center">
            <p className="text-muted-foreground">Selecciona un chat para comenzar</p>
          </div>
          <div className="hidden md:block flex-1 bg-[#d9e4c9] rounded-2xl" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-4 bg-white">
      <div className="flex flex-col md:flex-row gap-4 h-[calc(100dvh-92px)]">
        {/* Chat messages box */}
        <div className="flex-1 md:flex-[2] bg-orange-300 rounded-2xl flex flex-col min-h-0">
          {/* Chat header */}
          <div className="flex items-center gap-3 p-4 border-b border-[#c5d4b5]">
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-200 transition-colors"
                aria-label="Volver a chats"
              >
                <RiArrowLeftLine className="w-5 h-5 text-foreground" />
              </button>
            )}
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={selectedChat.avatar}
                alt={selectedChat.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{selectedChat.name}</h3>
              <p className="text-xs text-muted-foreground">En línea</p>
            </div>
          </div>

          {/* Offer Status Banner */}
          {!offerLoading && offer && (
            <div className="px-3 sm:px-4 py-3 bg-orange-200/60 border-b border-[#c5d4b5]">
              {offer.type === "direct_buy" ? (
                /* Comprar flow — price only */
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-foreground">
                      💰 Precio: <span className="font-semibold">${(offer.proposed_price ?? 0).toLocaleString("es-MX")} MXN</span>
                    </p>
                    {offer.status === "accepted" && (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 self-start">
                        ✅ Compra confirmada
                      </span>
                    )}
                  </div>
                  {isSeller && offer.status === "accepted" && (
                    <button
                      onClick={handleCancelAccepted}
                      disabled={cancelLoading}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-500 text-white rounded-lg text-sm font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50 active:scale-95 shrink-0 self-start"
                    >
                      <RiDeleteBinLine className="w-4 h-4" />
                      Cancelar venta
                    </button>
                  )}
                </div>
              ) : (
                /* Truequear flow — full negotiation banner */
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <OfferStatusBadge status={offer.status} />
                    {offer.proposed_price !== null && offer.proposed_price > 0 && (
                      <p className="text-sm text-foreground mt-1">
                        💰 Precio ofrecido: <span className="font-semibold">${offer.proposed_price.toLocaleString("es-MX")} MXN</span>
                      </p>
                    )}
                    {offer.barter_items && offer.barter_items.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {offer.barter_items.map((item) => (
                          <div key={item.id} className="bg-white/70 rounded-lg p-2 sm:p-3 text-sm break-words">
                            <p className="font-semibold">🔄 {item.title}</p>
                            {item.description && <p className="text-muted-foreground text-xs sm:text-sm">{item.description}</p>}
                            {item.estimated_value !== null && item.estimated_value > 0 && (
                              <p className="text-muted-foreground text-xs sm:text-sm">Valor estimado: ${item.estimated_value.toLocaleString("es-MX")} MXN</p>
                            )}
                            {item.image_url && (
                              <div className="relative w-full max-w-[8rem] h-32 sm:w-16 sm:h-16 rounded-lg overflow-hidden mt-2">
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Seller Actions */}
                  {isSeller && isPending && (
                    <div className="flex flex-row gap-2 sm:ml-auto shrink-0">
                      <button
                        onClick={handleAccept}
                        disabled={actionLoading}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2.5 sm:py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 active:scale-95"
                      >
                        <RiCheckLine className="w-4 h-4" />
                        Aceptar
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={actionLoading}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2.5 sm:py-2 bg-rose-500 text-white rounded-lg text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50 active:scale-95"
                      >
                        <RiCloseLine className="w-4 h-4" />
                        Rechazar
                      </button>
                    </div>
                  )}

                  {/* Seller cancel accepted offer */}
                  {isSeller && offer.status === "accepted" && (
                    <div className="flex flex-row gap-2 sm:ml-auto shrink-0">
                      <button
                        onClick={handleCancelAccepted}
                        disabled={cancelLoading}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1 px-3 py-2.5 sm:py-2 bg-slate-500 text-white rounded-lg text-sm font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50 active:scale-95"
                      >
                        <RiDeleteBinLine className="w-4 h-4" />
                        Cancelar trueque
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar min-h-0">
            {messages.map((message) => {
              const isYou = message.sender_id === profile?.id

              return (
                <div
                  key={message.id}
                  className={`flex ${isYou ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      isYou
                        ? "bg-orange-500 text-white rounded-br-md"
                        : "bg-white text-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isYou ? "text-white/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.sent_at ? format(new Date(message.sent_at), "HH:mm") : ""}
                    </p>
                  </div>
                </div>
              )
            })}

            <div ref={bottomRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-[#c5d4b5]">
            {canSendMessages ? (
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors shrink-0"
                >
                  <RiSendPlaneLine className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div className="text-center py-2 text-sm text-foreground/70 bg-white/50 rounded-full">
                {offer?.status === "rejected" && "Esta oferta fue rechazada"}
                {offer?.status === "canceled" && "Esta oferta fue cancelada"}
                {offer?.status === "invalidated" && "Esta oferta ya no es válida"}
                {offer?.status === "accepted" && "Oferta aceptada — puedes coordinar la entrega"}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:block flex-1 min-h-0">
          <InfoBox
            image={selectedChat.product.image}
            title={selectedChat.product.title}
            condition={selectedChat.product.condition}
            header="Producto en trueque"
            imageCliente={selectedChat.avatar}
            nombreCliente={selectedChat.name}
            estadoCliente="activo"
            headerCliente="Usuario"
          />
        </div>
      </div>
    </main>
  )
}

function OfferStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    accepted: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
    countered: "bg-blue-100 text-blue-800",
    canceled: "bg-slate-100 text-slate-800",
    invalidated: "bg-slate-100 text-slate-800",
  }

  const labels: Record<string, string> = {
    pending: "⏳ Pendiente",
    accepted: "✅ Aceptada",
    rejected: "❌ Rechazada",
    countered: "🔄 Contraoferta",
    canceled: "🚫 Cancelada",
    invalidated: "🚫 Invalidada",
  }

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {labels[status] || status}
    </span>
  )
}
