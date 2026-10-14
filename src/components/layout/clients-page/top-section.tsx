"use client"

import NextLink from "next/link"
import { FC } from "react"
import { LuCirclePlus } from "react-icons/lu"

import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"

const ClientsPageTopSection: FC = () => {
    const { t } = useI18n()

    return (
        <section className="pb-4">
            <div className="flex items-center justify-between">
                <Typography.H1>{t("clients.title")}</Typography.H1>
                <Button asChild size="sm">
                    <NextLink href="/clients/create">
                        <LuCirclePlus />
                        {t("clients.createClient")}
                    </NextLink>
                </Button>
            </div>
            <Typography.Muted className="mt-4 text-sm">{t("clients.description")}</Typography.Muted>
        </section>
    )
}

export default ClientsPageTopSection
