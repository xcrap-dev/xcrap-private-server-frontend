"use client"

import { useEffect, useState } from "react"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/layout/application/app-sidebar"
import { ThemeSwitcher } from "@/components/features/theme-switcher"
import LanguageSwitcher from "@/components/features/language-switcher"
import { useI18n } from "@/i18n"

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { t } = useI18n()
    const [defaultOpen, setDefaultOpen] = useState(true)

    useEffect(() => {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("sidebar_state="))
            ?.split("=")[1]

        setDefaultOpen(cookieValue === "true")
    }, [])

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="w-full min-h-screen flex flex-col">
                <header className="h-16 flex items-center justify-between px-4 border-b border-border/40">
                    <div className="flex items-center space-x-2">
                        <SidebarTrigger />
                        <span className="text-xs text-muted-foreground">{t("common.menu")}</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                    </div>
                </header>
                <div className="flex-1 px-4 py-4">{children}</div>
            </main>
        </SidebarProvider>
    )
}
