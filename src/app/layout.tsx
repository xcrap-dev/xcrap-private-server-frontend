import { Geist, Geist_Mono, Noto_Color_Emoji } from "next/font/google"
import type { Metadata } from "next"

import { Toaster } from "@/components/ui/sonner"
import Providers from "./providers"
import "./globals.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

const notoColorEmoji = Noto_Color_Emoji({
    weight: "400",
    variable: "--font-noto-color-emoji",
    subsets: ["emoji"],
})

export const metadata: Metadata = {
    title: "Xcrap",
    description: "Created by Marcuth",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${notoColorEmoji.variable} antialiased`}
            >
                <Providers>{children}</Providers>
                <Toaster />
            </body>
        </html>
    )
}
