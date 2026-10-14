import { type FC } from "react"
import { LuGlobe } from "react-icons/lu"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ScraperSdkCodeGenerator from "@/components/features/scraper-page/scraper-sdk-code-generator"
import { FindOneScraperResponse } from "@/services/api/scrapers"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import configHelper from "@/helpers/config"

type Props = {
    data: FindOneScraperResponse
    apiKey?: string
}

const routes = [
    {
        method: "GET",
        description: "Obter Informações - Retorna informações detalhadas sobre o scraper especificado.",
    },
    {
        method: "PATCH",
        description: "Atualizar Informações - Atualiza as informações do scraper especificado.",
    },
    {
        method: "DELETE",
        description: "Excluir Scraper - Remove o scraper especificado do sistema.",
    },
    {
        method: "POST",
        path: "execute",
        description: "Executar Scraper - Inicia a execução do scraper especificado e retorna o resultado.",
    },
]

const ScraperApiTab: FC<Props> = ({ data, apiKey }) => {
    return (
        <TabsContent value="api" className="space-y-6">
            <ScraperSdkCodeGenerator data={data} apiKey={apiKey} />
            <Separator className="my-6" />
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <LuGlobe className="w-4 h-4 text-primary" />
                    <Typography.H3>Endpoints HTTP (REST API)</Typography.H3>
                </div>
                <Typography.Muted>
                    Rotas diretas da API caso prefira realizar requisições HTTP manuais via cURL, Fetch ou Axios.
                </Typography.Muted>
            </div>

            <Table>
                <TableCaption>
                    Rotas da API relacionadas ao Scraper <b>{data.name}</b>.
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Método</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Descrição</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {routes.map((route) => (
                        <TableRow key={route.description}>
                            <TableCell className="font-medium">
                                <Badge>{route.method}</Badge>
                            </TableCell>
                            <TableCell>
                                {configHelper.apiUrl}/scrapers/{data.id}/{route.path && route.path}
                            </TableCell>
                            <TableCell>{route.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TabsContent>
    )
}

export default ScraperApiTab
