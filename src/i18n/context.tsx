"use client"

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react"
import { ptBR, I18nTranslations } from "./locales/pt-br"
import { en } from "./locales/en"
import { Locale, I18nContextType } from "./types"

const translationsMap: Record<Locale, I18nTranslations> = {
    "pt-BR": ptBR,
    en: en,
}

const STORAGE_KEY = "xcrap_locale"

const I18nContext = createContext<I18nContextType | null>(null)

export const I18nProvider: React.FC<{ children: ReactNode; defaultLocale?: Locale }> = ({
    children,
    defaultLocale = "en",
}) => {
    const [locale, setLocaleState] = useState<Locale>(defaultLocale)

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
        if (saved && (saved === "pt-BR" || saved === "en")) {
            setLocaleState(saved)
            document.documentElement.lang = saved === "pt-BR" ? "pt-BR" : "en"
        } else {
            setLocaleState("en")
            document.documentElement.lang = "en"
        }
    }, [])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        try {
            localStorage.setItem(STORAGE_KEY, newLocale)
            document.cookie = `${STORAGE_KEY}=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
            document.documentElement.lang = newLocale === "pt-BR" ? "pt-BR" : "en"
        } catch {
        }
    }

    const currentTranslations = useMemo(() => translationsMap[locale] || en, [locale])

    const t = useMemo(() => {
        return (path: string, params?: Record<string, string | number>): string => {
            const keys = path.split(".")
            let current: any = currentTranslations

            for (const key of keys) {
                if (current && typeof current === "object" && key in current) {
                    current = current[key]
                } else {
                    let fallback: any = en
                    for (const fallbackKey of keys) {
                        if (fallback && typeof fallback === "object" && fallbackKey in fallback) {
                            fallback = fallback[fallbackKey]
                        } else {
                            fallback = path
                            break
                        }
                    }
                    current = fallback
                    break
                }
            }

            if (typeof current !== "string") {
                return path
            }

            if (params) {
                return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
                    return acc.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(paramValue))
                }, current)
            }

            return current
        }
    }, [currentTranslations])

    const value: I18nContextType = useMemo(
        () => ({
            locale,
            setLocale,
            t,
            translations: currentTranslations,
            isPt: locale === "pt-BR",
            isEn: locale === "en",
        }),
        [locale, currentTranslations, t],
    )

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = (): I18nContextType => {
    const context = useContext(I18nContext)
    if (!context) {
        throw new Error("useI18n must be used within an I18nProvider")
    }
    return context
}

export const useTranslation = useI18n
