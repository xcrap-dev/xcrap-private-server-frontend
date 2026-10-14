"use client"

import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { FC, ReactNode } from "react"
import { I18nProvider } from "@/i18n"

type Props = {
    children: ReactNode
}

const Providers: FC<Props> = ({ children }) => {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system" themes={["light", "dark"]}>
                <I18nProvider>{children}</I18nProvider>
            </ThemeProvider>
        </SessionProvider>
    )
}

export default Providers
