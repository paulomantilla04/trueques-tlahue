"use client"

import { useState } from "react"
import { ChatContent } from "@/components/mensa/chat-content"
import { ChatSidebar } from "@/components/mensa/chat-sidebar"
import { useChatList } from "@/hooks/useChat"

interface MessagesViewProps {
  initialChatId?: string | null
}

export function MessagesView({ initialChatId = null }: MessagesViewProps) {
  const { chats, loading } = useChatList()
  const [selectedChat, setSelectedChat] = useState<string | null>(initialChatId)

  const activeChatId = selectedChat ?? chats[0]?.id ?? null
  const activeChat = chats.find((c) => c.id === activeChatId) || null

  if (loading) return <p>Cargando chats...</p>

  return (
    <div className="flex h-[calc(100vh-74px)] overflow-hidden w-full "> 
      <ChatSidebar
        chats={chats}
        selectedChat={activeChatId}
        onSelectChat={setSelectedChat}
      />
      <div className="flex-1 min-w-0 overflow-hidden">
        <ChatContent selectedChat={activeChat} />
      </div>
    </div>
  )
}