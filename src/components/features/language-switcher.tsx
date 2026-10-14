"use client"

import React, { FC } from "react"
import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LuGlobe } from "react-icons/lu"

interface LanguageSwitcherProps {
    variant?: "pill" | "dropdown" | "button"
    className?: string
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ variant = "pill", className }) => {
    const { setLocale, isPt, isEn } = useI18n()

    if (variant === "dropdown") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className={cn("h-8 px-2 gap-1.5 text-xs", className)}>
                        <LuGlobe className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{isPt ? "PT-BR" : "EN"}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs">
                    <DropdownMenuItem
                        onClick={() => setLocale("pt-BR")}
                        className={cn("cursor-pointer flex items-center gap-2", isPt && "font-semibold text-primary")}
                    >
                        <span className="font-emoji">🇧🇷</span>
                        <span>Português (Brasil)</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setLocale("en")}
                        className={cn("cursor-pointer flex items-center gap-2", isEn && "font-semibold text-primary")}
                    >
                        <span className="font-emoji">🇺🇸</span>
                        <span>English (US)</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <div
            role="group"
            aria-label="Language selection"
            className={cn(
                "inline-flex h-8 items-center rounded-full border border-border bg-card/60 backdrop-blur-xs p-0.5 text-[11px] font-medium tracking-wide shadow-xs",
                className,
            )}
        >
            <button
                type="button"
                onClick={() => setLocale("en")}
                aria-pressed={isEn}
                className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all duration-200 cursor-pointer select-none",
                    isEn
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                )}
                title="English (US)"
            >
                <span className="font-emoji text-[12px] leading-none">🇺🇸</span>
                <span>EN</span>
            </button>
            <button
                type="button"
                onClick={() => setLocale("pt-BR")}
                aria-pressed={isPt}
                className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all duration-200 cursor-pointer select-none",
                    isPt
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                )}
                title="Português (Brasil)"
            >
                <span className="font-emoji text-[12px] leading-none">🇧🇷</span>
                <span>PT</span>
            </button>
        </div>
    )
}

export default LanguageSwitcher
