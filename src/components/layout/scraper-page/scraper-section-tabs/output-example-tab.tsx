"use client"

import { LuFileJson, LuSparkles } from "react-icons/lu"
import { type FC, useMemo } from "react"

import { inferParsingModelOutput } from "@/utils/infer-parsing-model-output"
import { FindOneScraperResponse } from "@/services/api/scrapers"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import JsonViewer from "@/components/features/json-viwer"
import { Typography } from "@/components/ui/typography"
import { TabsContent } from "@/components/ui/tabs"

type Props = {
    data: FindOneScraperResponse
}

const ScraperOutputExampleTab: FC<Props> = ({ data }) => {
    const output = useMemo(() => {
        return inferParsingModelOutput(data.parsingModel)
    }, [data.parsingModel])

    const hasData = Object.keys(output).length > 0

    return (
        <TabsContent value="output-example" className="space-y-4">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <LuSparkles className="w-4 h-4 text-primary" />
                    <Typography.H3>Exemplo de Saída Inferido</Typography.H3>
                </div>
                <Typography.Muted>
                    Exemplo representativo da estrutura JSON que o scraper <b>{data.name}</b> produzirá ao ser
                    executado, com base nos seletores e extratores configurados no seu modelo de parsing.
                </Typography.Muted>
            </div>

            {hasData ? (
                <Card>
                    <CardHeader className="py-3 px-4 bg-muted/40 border-b flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <LuFileJson className="w-4 h-4 text-muted-foreground" />
                            <Typography.Small className="font-mono text-xs">
                                scraper-{data.id}-output.json
                            </Typography.Small>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <JsonViewer
                            data={output}
                            initialExpanded={true}
                            fileName={`scraper-${data.id}-exemplo-saida.json`}
                        />
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-dashed">
                    <CardContent className="py-12 text-center space-y-3">
                        <LuFileJson className="w-10 h-10 text-muted-foreground/60 mx-auto" />
                        <div className="space-y-1">
                            <Typography.H4>Nenhum campo configurado no modelo de parsing</Typography.H4>
                            <Typography.Muted>
                                Este scraper ainda não possui campos definidos em seu modelo de parsing.
                            </Typography.Muted>
                        </div>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
    )
}

export default ScraperOutputExampleTab
