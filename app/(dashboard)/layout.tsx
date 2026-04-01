import { Montserrat } from "next/font/google"
import { FloatingNavbar } from "@/components/dashboard/floating-navbar"

const montserrat = Montserrat({ subsets: ["latin"] })

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`min-h-screen bg-slate-100 ${montserrat.className}`}>
      <FloatingNavbar />
      <div className="pt-24">{children}</div>
    </div>
  )
}
