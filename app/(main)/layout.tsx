import { Montserrat } from "next/font/google"
import { Header } from "@/components/home/header"

const montserrat = Montserrat({ subsets: ["latin"] })


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`min-h-screen bg-slate-100 ${montserrat.className}`}>
      <Header />
      <div>{children}</div>
    </div>
  )
}
