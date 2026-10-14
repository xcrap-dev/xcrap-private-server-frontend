"use client"

import { FC } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { FaSpider } from "react-icons/fa"
import {
    LuArrowRight,
    LuGlobe,
    LuKey,
    LuSparkles,
    LuTerminal,
} from "react-icons/lu"

import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/features/theme-switcher"
import LanguageSwitcher from "@/components/features/language-switcher"
import { useI18n } from "@/i18n"
import logoDarkSvg from "../../public/assets/images/xcrap-logo-dark.svg"
import logoSquareDarkSvg from "../../public/assets/images/xcrap-logo-square.svg"

const WelcomePage: FC = () => {
    const { t } = useI18n()
    const { data: session, status } = useSession()
    const isAuthenticated = status === "authenticated" && !!session

    return (
        <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-primary/20 selection:text-primary overflow-x-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
                <div className="absolute top-0 h-[450px] w-full max-w-5xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl opacity-70" />
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />
            </div>

            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center group">
                        <img
                            src={logoDarkSvg.src}
                            alt="Xcrap Logo"
                            className="h-6 w-auto object-contain invert dark:invert-0"
                        />
                    </Link>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                        {isAuthenticated ? (
                            <Button asChild size="sm" className="gap-1.5 shadow-sm text-xs font-medium">
                                <Link href="/scrapers">
                                    <span>{t("welcome.goToDashboard")}</span>
                                    <LuArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </Button>
                        ) : (
                            <Button asChild size="sm" className="gap-1.5 shadow-sm text-xs font-medium">
                                <Link href="/auth/sign-in">
                                    <span>{t("welcome.signIn")}</span>
                                    <LuArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 sm:py-24 flex flex-col items-center text-center justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-xs px-3.5 py-1 text-xs text-muted-foreground shadow-xs animate-in fade-in duration-500">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-medium text-foreground">{t("welcome.badge")}</span>
                    <span className="text-border">|</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {t("welcome.statusOnline")}
                    </span>
                </div>

                <h1 className="mt-8 text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-[1.12]">
                    {t("welcome.title")}
                </h1>

                <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    {t("welcome.subtitle")}
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {isAuthenticated ? (
                        <Button asChild size="lg" className="w-full sm:w-auto px-6 h-11 text-sm font-semibold shadow-md">
                            <Link href="/scrapers">
                                <FaSpider className="mr-2 h-4 w-4" />
                                {t("welcome.goToDashboard")}
                                <LuArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild size="lg" className="w-full sm:w-auto px-6 h-11 text-sm font-semibold shadow-md">
                            <Link href="/auth/sign-in">
                                {t("welcome.signIn")}
                                <LuArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    )}

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto px-6 h-11 text-sm font-medium border-border/80 hover:bg-muted/50"
                    >
                        <Link href="/scrapers">
                            <LuTerminal className="mr-2 h-4 w-4 text-muted-foreground" />
                            {t("welcome.viewScrapers")}
                        </Link>
                    </Button>
                </div>

                <div className="mt-20 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                    <div className="rounded-xl border border-border/60 bg-card/50 p-6 backdrop-blur-xs transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-xs">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <LuSparkles className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">
                            {t("welcome.features.parsersTitle")}
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            {t("welcome.features.parsersDesc")}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card/50 p-6 backdrop-blur-xs transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-xs">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <LuGlobe className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">
                            {t("welcome.features.clientsTitle")}
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            {t("welcome.features.clientsDesc")}
                        </p>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-card/50 p-6 backdrop-blur-xs transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-xs">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <LuKey className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-semibold text-foreground">
                            {t("welcome.features.sdkTitle")}
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                            {t("welcome.features.sdkDesc")}
                        </p>
                    </div>
                </div>
            </main>

            <footer className="border-t border-border/40 py-6 px-6 bg-background/50">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <img
                            src={logoSquareDarkSvg.src}
                            alt="Xcrap"
                            className="h-4 w-4 object-contain invert dark:invert-0 opacity-70"
                        />
                        <span>
                            © {new Date().getFullYear()} Xcrap Cloud. {t("common.allRightsReserved")}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>Private Server Engine</span>
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default WelcomePage
