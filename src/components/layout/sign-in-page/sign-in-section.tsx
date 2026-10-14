"use client"

import { FC } from "react"
import Link from "next/link"
import SignInForm from "./sign-in-form"
import LanguageSwitcher from "@/components/features/language-switcher"
import { ThemeSwitcher } from "@/components/features/theme-switcher"
import logoSquareDarkSvg from "../../../../public/assets/images/xcrap-logo-square.svg"
import logoDarkSvg from "../../../../public/assets/images/xcrap-logo-dark.svg"

const SignInSection: FC = () => {
    return (
        <section className="relative flex min-h-svh w-full flex-col justify-between p-6 md:p-10">
            <header className="flex w-full items-center justify-between">
                <Link href="/" className="flex items-center group">
                    <img
                        src={logoDarkSvg.src}
                        alt="Xcrap Logo"
                        className="h-6 w-auto object-contain invert dark:invert-0"
                    />
                </Link>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>
            </header>

            <div className="flex w-full items-center justify-center my-auto">
                <div className="w-full max-w-sm">
                    <SignInForm />
                </div>
            </div>

            <footer className="text-center text-xs text-muted-foreground">
                <span>© {new Date().getFullYear()} Xcrap Cloud.</span>
            </footer>
        </section>
    )
}

export default SignInSection
