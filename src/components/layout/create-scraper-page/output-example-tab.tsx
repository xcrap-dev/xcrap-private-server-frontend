"use client"

import { useFormContext } from "react-hook-form"
import { LuCode, LuFileJson, LuRefreshCw, LuSparkles } from "react-icons/lu"
import { type FC, useMemo, useState } from "react"

import { inferParsingModelOutput } from "@/utils/infer-parsing-model-output"
import { useCurrentUserApiKey } from "@/hooks/use-current-user-api-key"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateScraperDto } from "@/dto/scrapers/create-scraper"
import JsonViewer from "@/components/features/json-viwer"
import { Typography } from "@/components/ui/typography"
import CodeBlock from "@/components/ui/code-block"
import { TabsContent } from "@/components/ui/tabs"
import configHelper from "@/helpers/config"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"

type Props = {
    value?: string
}

const OutputExampleTab: FC<Props> = ({ value = "output-example" }) => {
    const { t } = useI18n()
    const form = useFormContext<CreateScraperDto>()
    const [refreshToken, setRefreshToken] = useState(0)
    const [viewMode, setViewMode] = useState<"json" | "sdk">("json")
    const { apiKey: userApiKey } = useCurrentUserApiKey()

    const parsingModel = useMemo(() => {
        return form.getValues("parsingModel")
    }, [form, refreshToken])

    const output = useMemo(() => {
        return inferParsingModelOutput(parsingModel)
    }, [parsingModel])

    const hasData = Object.keys(output).length > 0

    const dynamicSdkCode = useMemo(() => {
        const formValues = form.getValues()
        const baseUrl = configHelper.apiUrl || "http://localhost:3000/api"
        const effectiveApiKey = userApiKey || "YOUR_API_KEY_HERE"
        const formattedModel = JSON.stringify(parsingModel, null, 2)
            .split("\n")
            .map((line, idx) => (idx === 0 ? line : `  ${line}`))
            .join("\n")

        return `import { Xcrap } from "@xcrap/api"

const xcrap = new Xcrap({
  apiKey: "${effectiveApiKey}",
  baseUrl: "${baseUrl}",
})

async function run() {
  const { data, metadata } = await xcrap.scrapers.executeOneDynamic({
    url: "${formValues.defaultUrl || "https://example.com"}",
    clientId: "${formValues.clientId || "YOUR_CLIENT_ID"}",
    parsingModel: ${formattedModel},
  })

  console.log("Status HTTP:", metadata.response.status)
  console.log("Duration:", metadata.request.duration, "ms")
  console.log(JSON.stringify(data, null, 2))
}

run().catch(console.error)`
    }, [form, parsingModel, userApiKey])

    const handleRefresh = () => {
        setRefreshToken((prev) => prev + 1)
    }

    return (
        <TabsContent value={value} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <LuSparkles className="w-4 h-4 text-primary" />
                        <Typography.H3>{t("createScraper.outputExampleTitle")}</Typography.H3>
                    </div>
                    <Typography.Muted>
                        {t("createScraper.outputExampleDesc")}
                    </Typography.Muted>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as "json" | "sdk")}>
                        <TabsList className="h-8">
                            <TabsTrigger value="json" className="text-xs flex items-center gap-1.5 h-7">
                                <LuFileJson className="w-3.5 h-3.5" /> {t("createScraper.jsonOutput")}
                            </TabsTrigger>
                            <TabsTrigger value="sdk" className="text-xs flex items-center gap-1.5 h-7">
                                <LuCode className="w-3.5 h-3.5" /> {t("createScraper.sdkCode")}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button variant="outline" size="sm" type="button" onClick={handleRefresh} className="h-8">
                        <LuRefreshCw className="w-3.5 h-3.5" /> {t("createScraper.refresh")}
                    </Button>
                </div>
            </div>

            {hasData ? (
                viewMode === "json" ? (
                    <Card>
                        <CardHeader className="py-3 px-4 bg-muted/40 border-b flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <LuFileJson className="w-4 h-4 text-muted-foreground" />
                                <Typography.Small className="font-mono text-xs">output.json</Typography.Small>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <JsonViewer data={output} initialExpanded={true} fileName="scraper-output-example.json" />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        <CodeBlock
                            code={dynamicSdkCode}
                            language="typescript"
                            fileName="execute-dynamic-scraper.ts"
                        />
                    </div>
                )
            ) : (
                <Card className="border-dashed">
                    <CardContent className="py-12 text-center space-y-3">
                        <LuFileJson className="w-10 h-10 text-muted-foreground/60 mx-auto" />
                        <div className="space-y-1">
                            <Typography.H4>{t("createScraper.noFieldsYet")}</Typography.H4>
                            <Typography.Muted>
                                {t("createScraper.noFieldsDesc")}
                            </Typography.Muted>
                        </div>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
    )
}

export default OutputExampleTab
