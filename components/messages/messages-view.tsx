"use client"

import { useState } from "react"
import { ChatContent } from "@/components/messages/chat-content"
import { ChatSidebar } from "@/components/messages/chat-sidebar"
import { useChatList } from "@/hooks/useChat"

interface MessagesViewProps {
  initialChatId?: string | null
}

export function MessagesView({ initialChatId = null }: MessagesViewProps) {
  const { chats, loading } = useChatList()
  const [selectedChat, setSelectedChat] = useState<string | null>(initialChatId)
  const [showMobileChat, setShowMobileChat] = useState(!!initialChatId)

  const activeChatId = selectedChat ?? chats[0]?.id ?? null
  const activeChat = chats.find((c) => c.id === activeChatId) || null

  const handleSelectChat = (id: string) => {
    setSelectedChat(id)
    setShowMobileChat(true)
  }

  const handleBack = () => {
    setShowMobileChat(false)
  }

  if (loading) return <p>Cargando chats...</p>

  return (
    <div className="flex h-[calc(100dvh-74px)] overflow-hidden w-full">
      <ChatSidebar
        chats={chats}
        selectedChat={activeChatId}
        onSelectChat={handleSelectChat}
        className={`${showMobileChat ? "hidden md:flex" : "flex"} w-full md:w-56`}
      />
      <div className={`${showMobileChat ? "flex" : "hidden md:flex"} flex-1 min-w-0 overflow-hidden`}>
        <ChatContent selectedChat={activeChat} onBack={handleBack} />
      </div>
    </div>
  )
}