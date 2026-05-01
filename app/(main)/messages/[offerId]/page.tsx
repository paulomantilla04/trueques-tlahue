"use client"

import { use } from "react"
import { MessagesView } from "@/components/mensa/messages-view"

export default function ChatPage({
  params,
}: {
  params: Promise<{ offerId: string }>
}) {
  const { offerId } = use(params)

  return (
    <div className="bg-white">
      <MessagesView initialChatId={offerId} />

    </div>

  )
}