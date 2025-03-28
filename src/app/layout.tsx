import type { Metadata } from "next"
import { Domine, Unna } from "next/font/google"
import "./globals.css"

export const metadata: Metadata = {
  title: "Trello Clone",
  description: "Lorem ipsum dolor sit amet.",
}

const domine = Domine({
  variable: "--font-domine",
  subsets: ["latin"],
})

const unna = Unna({
  variable: "--font-unna",
  weight: ["400", "700"],
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${domine.variable} ${unna.variable}`}>{children}</body>
    </html>
  )
}
