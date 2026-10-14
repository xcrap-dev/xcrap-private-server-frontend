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

type Props = {
    value?: string
}

const OutputExampleTab: FC<Props> = ({ value = "output-example" }) => {
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
        const effectiveApiKey = userApiKey || "SUA_API_KEY_AQUI"
        const formattedModel = JSON.stringify(parsingModel, null, 2)
            .split("\n")
            .map((line, idx) => (idx === 0 ? line : `  ${line}`))
            .join("\n")

        return `import { Xcrap } from "@xcrap/api"

// 1. Inicialize o SDK Xcrap com sua API Key e a URL do servidor
const xcrap = new Xcrap({
  apiKey: "${effectiveApiKey}",
  baseUrl: "${baseUrl}",
})

async function run() {
  console.log("Executando scraper dinâmico...")

  // 2. Executa a raspagem em tempo real passando o modelo de parsing configurado
  const { data, metadata } = await xcrap.scrapers.executeOneDynamic({
    url: "${formValues.defaultUrl || "https://example.com"}",
    clientId: "${formValues.clientId || "SEU_CLIENT_ID"}",
    parsingModel: ${formattedModel},
  })

  console.log("Status HTTP:", metadata.response.status)
  console.log("Duração:", metadata.request.duration, "ms")
  console.log("Resultado da extração:")
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
                        <Typography.H3>Exemplo de Saída Inferido</Typography.H3>
                    </div>
                    <Typography.Muted>
                        Estrutura JSON estimada e código de integração Node.js que o scraper produzirá com base no
                        modelo configurado.
                    </Typography.Muted>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as "json" | "sdk")}>
                        <TabsList className="h-8">
                            <TabsTrigger value="json" className="text-xs flex items-center gap-1.5 h-7">
                                <LuFileJson className="w-3.5 h-3.5" /> JSON de Saída
                            </TabsTrigger>
                            <TabsTrigger value="sdk" className="text-xs flex items-center gap-1.5 h-7">
                                <LuCode className="w-3.5 h-3.5" /> Código SDK (@xcrap/api)
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button variant="outline" size="sm" type="button" onClick={handleRefresh} className="h-8">
                        <LuRefreshCw className="w-3.5 h-3.5" /> Atualizar
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
                            <JsonViewer data={output} initialExpanded={true} fileName="exemplo-saida-scraper.json" />
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
                            <Typography.H4>Nenhum campo configurado ainda</Typography.H4>
                            <Typography.Muted>
                                Vá para a aba &quot;Modelo de Parsing&quot; e adicione campos para visualizar a
                                inferência da estrutura de saída e o código SDK.
                            </Typography.Muted>
                        </div>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
    )
}

export default OutputExampleTab
