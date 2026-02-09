import type { Metadata } from "next"
import { Cardo } from "next/font/google"
import "./globals.css"

const cardo = Cardo({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-cardo" })

export const metadata: Metadata = {
  title: "Page Gallery | Literary Platform",
  description: "A curated literary submission platform for poetry, prose, and essays.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${cardo.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
