"use client"

import { FC } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import CreateScraperForm from "./create-scraper-form"
import { useI18n } from "@/i18n"

type Props = {
    accessToken: string
}

const CreateScraperSection: FC<Props> = ({ accessToken }) => {
    const { t } = useI18n()

    return (
        <section>
            <Card>
                <CardHeader>
                    <CardTitle>{t("createScraper.sectionTitle")}</CardTitle>
                    <CardDescription>{t("createScraper.sectionDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateScraperForm accessToken={accessToken} />
                </CardContent>
            </Card>
        </section>
    )
}

export default CreateScraperSection
