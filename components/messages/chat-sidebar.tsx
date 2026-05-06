import Image from "next/image"

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  isYou: boolean
  status: string
  type: string
  isBuyer: boolean
  product: {
    title: string
    condition: string
    image: string
  }
}

interface ChatSidebarProps {
  chats: Chat[]
  selectedChat: string | null
  onSelectChat: (id: string) => void
  className?: string
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
  countered: "Contraoferta",
  canceled: "Cancelada",
  invalidated: "Invalidada",
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-400",
  accepted: "bg-emerald-400",
  rejected: "bg-rose-400",
  countered: "bg-blue-400",
  canceled: "bg-slate-400",
  invalidated: "bg-slate-400",
}

export function ChatSidebar({ chats, selectedChat, onSelectChat, className = "" }: ChatSidebarProps) {
  return (
    <aside className={`bg-card flex flex-col overflow-hidden shrink-0 h-full bg-orange-200 ${className}`}>
      <h2 className="text-2xl font-bold text-primary p-4 pb-2 shrink-0">Chats</h2>

      <div className="relative flex-1 min-h-0 bg-orange-200">
        <div className="h-full overflow-y-auto px-4 pb-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                selectedChat === chat.id
                  ? "bg-orange-300 text-white shadow-md"
                  : "hover:bg-orange-200"
              }`}
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image src={chat.avatar} alt={chat.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground text-sm truncate">{chat.product.title}</p>
                  <span className={`w-2 h-2 rounded-full shrink-0 ml-1 ${statusColors[chat.status] || "bg-gray-400"}`} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                  {chat.type === "direct_buy"
                    ? "Compra directa"
                    : statusLabels[chat.status] || chat.status}
                  {chat.type === "negotiation" && !chat.isBuyer && chat.status === "pending" && " — ¡Nueva oferta!"}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-orange-100 to-transparent pointer-events-none" />
      </div>
    </aside>
  )
}
