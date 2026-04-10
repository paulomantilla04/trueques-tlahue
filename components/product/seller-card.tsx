import { RiCalendarLine } from "react-icons/ri";
import Image from "next/image";

export default function SellerCard({
  seller,
}: {
  seller: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    created_at?: string;
  };
}) {
  const joinYear = seller.created_at
    ? new Date(seller.created_at).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="rounded-2xl border border-black/8 bg-white/70 backdrop-blur-sm p-5 flex items-center gap-4 shadow-sm">
      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-orange-100 shrink-0 bg-slate-100">
        <Image
          src={seller.avatar_url ?? "/placeholder-user.png"}
          alt={seller.display_name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-black/40 font-medium uppercase tracking-wider mb-0.5">
          Vendedor
        </p>
        <p className="text-base font-semibold text-black truncate">
          {seller.display_name}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <RiCalendarLine className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <p className="text-xs text-black/50">
            En Trueques Tlahue desde {joinYear}
          </p>
        </div>
      </div>
    </div>
  );
}