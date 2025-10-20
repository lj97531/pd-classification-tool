import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PTNM Classification System - Peyronie's Disease",
  description: "AI-powered Peyronie's Disease classification using the PTNM system based on evidence-based criteria",
  keywords: ["Peyronie's Disease", "PTNM Classification", "Medical Classification", "Urology"],
  authors: [{ name: "Medical Classification Tool" }],
  openGraph: {
    title: "PTNM Classification System",
    description: "AI-powered Peyronie's Disease classification tool",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
