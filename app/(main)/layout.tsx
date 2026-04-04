import { Montserrat } from "next/font/google"
import { Header } from "@/components/home/header"
import { SearchProvider } from "@/components/home/SearchContext"

const montserrat = Montserrat({ subsets: ["latin"] })

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SearchProvider>
      <div className={`min-h-screen bg-slate-100 ${montserrat.className}`}>
        <Header />
        <div>{children}</div>
      </div>
    </SearchProvider>
  )
}
