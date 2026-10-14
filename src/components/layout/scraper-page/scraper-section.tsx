"use client"

import { LuBraces, LuFileJson2, LuInfo, LuPlay, LuSparkles, LuUnplug } from "react-icons/lu"
import { useRouter, useSearchParams } from "next/navigation"
import { HiDotsVertical } from "react-icons/hi"
import { FaSpider } from "react-icons/fa"
import { FC, useState } from "react"
import { toast } from "sonner"

import { executeOneScraper, ExecuteOneScraperResponse, FindOneScraperResponse } from "@/services/api/scrapers"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ScraperExecutionDialog from "@/components/features/scraper-page/scraper-execution-dialog"
import ScraperDropdownMenu from "@/components/features/scraper-page/scraper-dropdown-menu"
import ScraperExecutionOutputTab from "./scraper-section-tabs/execution-output-tab"
import ScraperOutputExampleTab from "./scraper-section-tabs/output-example-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrentUserApiKey } from "@/hooks/use-current-user-api-key"
import ScraperParsingModelTab from "./scraper-section-tabs/parsing-model-tab"
import ScraperBasicInfoTab from "./scraper-section-tabs/basic-info-tab"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ScraperApiTab from "./scraper-section-tabs/api-tab"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/components/ui/link"

type Props = {
    data: FindOneScraperResponse
    accessToken: string
}

const ScraperPageSection: FC<Props> = ({ data, accessToken }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { apiKey } = useCurrentUserApiKey(accessToken)
    const [executionResponse, setExecutionResponse] = useState<ExecuteOneScraperResponse<any> | null>(null)
    const [isExecuting, setIsExecuting] = useState(false)
    const tab = searchParams.get("tab") || "basic-info"

    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()))

        params.set("tab", newTab)

        router.replace(`?${params.toString()}`, { scroll: false })
    }

    const handleExecute = async (executeUrl?: string) => {
        const targetUrl = executeUrl || data.defaultUrl

        if (!targetUrl) {
            toast.error("Nenhuma URL disponível para execução.")
            return
        }

        setExecutionResponse(null)
        handleTabChange("execution-output")
        setIsExecuting(true)

        try {
            const response = await executeOneScraper<any>(data.id, { url: targetUrl }, accessToken)
            setExecutionResponse(response)
        } catch (error) {
            console.error(error)
            toast.error("Ocorreu um erro ao executar o scraper.")
        } finally {
            setIsExecuting(false)
        }
    }

    return (
        <section>
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <FaSpider /> {data.name}{" "}
                            {isExecuting && (
                                <Badge variant="outline" className="opacity-50">
                                    Executando...
                                </Badge>
                            )}
                        </div>
                        <div className="space-x-1">
                            <ScraperExecutionDialog
                                sholdProvideUrl={data.defaultUrl ? false : true}
                                disabled={isExecuting}
                                onExecute={handleExecute}
                            >
                                <Button className="rounded-full" variant="ghost" title="Executar">
                                    {isExecuting ? <Spinner /> : <LuPlay />}
                                </Button>
                            </ScraperExecutionDialog>
                            <ScraperDropdownMenu data={data} accessToken={accessToken}>
                                <Button className="rounded-full" variant="ghost" title="Abrir menu">
                                    <HiDotsVertical />
                                </Button>
                            </ScraperDropdownMenu>
                        </div>
                    </CardTitle>
                    {data.description && <CardDescription>{data.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                    <Tabs value={tab} onValueChange={handleTabChange}>
                        <TabsList className="mb-4">
                            <TabsTrigger disabled={isExecuting} value="basic-info">
                                <LuInfo /> Informações Básicas
                            </TabsTrigger>
                            <TabsTrigger disabled={isExecuting} value="parsing-model">
                                <LuBraces /> Modelo de Parsing
                            </TabsTrigger>
                            <TabsTrigger disabled={isExecuting} value="output-example">
                                <LuSparkles /> Exemplo de Saída
                            </TabsTrigger>
                            <TabsTrigger value="execution-output">
                                <LuFileJson2 /> Saída de Execução
                            </TabsTrigger>
                            <TabsTrigger disabled={isExecuting} value="api">
                                <LuUnplug /> API
                            </TabsTrigger>
                        </TabsList>
                        <ScraperBasicInfoTab data={data} />
                        <ScraperParsingModelTab data={data} />
                        <ScraperOutputExampleTab data={data} />
                        <ScraperExecutionOutputTab response={executionResponse} scraper={data} />
                        <ScraperApiTab data={data} apiKey={apiKey} />
                    </Tabs>
                </CardContent>
                <Separator />
                <CardFooter className="block space-y-2">
                    <Typography.P>Criado por:</Typography.P>
                    <div className="flex gap-2 items-center">
                        <Avatar>
                            <AvatarFallback>{data.owner.name[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <Typography.Muted>{data.owner.name}</Typography.Muted>
                    </div>
                </CardFooter>
            </Card>
        </section>
    )
}

export default ScraperPageSection
