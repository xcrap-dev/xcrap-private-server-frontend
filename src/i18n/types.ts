import { I18nTranslations } from "./locales/pt-br"

export type Locale = "pt-BR" | "en"

export interface I18nContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (path: string, params?: Record<string, string | number>) => string
    translations: I18nTranslations
    isPt: boolean
    isEn: boolean
}
