"use client"

import { LuCirclePlus } from "react-icons/lu"
import NextLink from "next/link"
import { FC } from "react"

import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"

const ScrapersPageTopSection: FC = () => {
    const { t } = useI18n()

    return (
        <section className="pb-4">
            <div className="flex items-center justify-between">
                <Typography.H1>{t("scrapers.title")}</Typography.H1>
                <Button asChild size="sm">
                    <NextLink href="/scrapers/create">
                        <LuCirclePlus />
                        {t("scrapers.createScraper")}
                    </NextLink>
                </Button>
            </div>
            <Typography.Muted className="mt-4 text-sm">{t("scrapers.description")}</Typography.Muted>
        </section>
    )
}

export default ScrapersPageTopSection
