"use client"

import { useState } from "react"
import Image from "next/image"
import { RiSendPlaneLine } from "react-icons/ri"
import { format } from "date-fns"

import { useMessages } from "@/hooks/useMessages"
import { useProfile } from "@/hooks/useProfile" 

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
}

export function ChatContent({ selectedChat }: ChatContentProps) {
  const [newMessage, setNewMessage] = useState("")
  

  const { profile } = useProfile()

  const { messages, sendMessage, bottomRef } = useMessages(selectedChat?.id || "")

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

  if (!selectedChat) {
    return (
      <main className="flex-1 p-4 bg-white">
        <div className="flex gap-4 h-[calc(100vh-92px)]">
          <div className="flex-2 bg-[#d9e4c9] rounded-2xl flex items-center justify-center">
            <p className="text-muted-foreground">Selecciona un chat para comenzar</p>
          </div>
          <div className="flex-1 bg-[#d9e4c9] rounded-2xl" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-4 bg-white">
      <div className="flex gap-4 h-[calc(100vh-92px)]">
        {/* Chat messages box */}
        <div className="flex-2 bg-orange-300 rounded-2xl flex flex-col">
          {/* Chat header */}
          <div className="flex items-center gap-3 p-4 border-b border-[#c5d4b5]">
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

          <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
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

                    <p className="text-sm">{message.body}</p>
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

      
          <div className="p-4 border-t border-[#c5d4b5]">
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
                className="w-8 h-8 bg-orange-300 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
              >
                <RiSendPlaneLine className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>


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
    </main>
  )
}