import Image from "next/image"

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  isYou: boolean
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
}

export function ChatSidebar({ chats, selectedChat, onSelectChat }: ChatSidebarProps) {
  return (
   <aside className="w-56 bg-card flex flex-col overflow-hidden shrink-0 h-full bg-orange-300">
  <h2 className="text-2xl font-bold text-primary p-4 pb-2 shrink-0">Chats</h2>
  
  <div className="relative flex-1 min-h-0 bg-orange-300"> 
    <div className="h-full overflow-y-auto px-4 pb-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
            selectedChat === chat.id
              ? "bg-orange-400 text-white shadow-md"
              : "hover:bg-orange-200"
          }`}
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
            <Image src={chat.avatar} alt={chat.name} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-sm truncate">{chat.product.title}</p>
            <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
          </div>
        </button>
      ))}
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-orange-100 to-transparent pointer-events-none" />
  </div>
</aside>
  )
}