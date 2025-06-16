import type { Metadata } from "next"
import { Domine, Unna } from "next/font/google"
import "./globals.css"
import { ToastContainer } from "react-toastify"
import UserLoader from "@/components/UserLoader"

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
      <UserLoader />
      <body className={`${domine.variable} ${unna.variable}`}>
        {children}

        <ToastContainer
          position="top-right"
          autoClose={4000}
          closeOnClick
          pauseOnHover
          theme="light"
          limit={4}
          stacked
        />
      </body>
    </html>
  )
}
