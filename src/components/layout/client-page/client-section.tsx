"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { LuGlobe, LuInfo, LuUnplug } from "react-icons/lu"
import { HiDotsVertical } from "react-icons/hi"
import { FC } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ClientDropdownMenu from "@/components/features/client-page/client-dropdown-menu"
import ClientBasicInfoTab from "./client-section-tabs/basic-info-tab"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FindOneClientResponse } from "@/services/api/clients"
import { useCurrentUserApiKey } from "@/hooks/use-current-user-api-key"
import ClientApiTab from "./client-section-tabs/api-tab"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"

type Props = {
    data: FindOneClientResponse
    accessToken: string
}

const ClientPageSection: FC<Props> = ({ data, accessToken }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { apiKey } = useCurrentUserApiKey(accessToken)
    const tab = searchParams.get("tab") || "basic-info"

    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()))

        params.set("tab", newTab)

        router.replace(`?${params.toString()}`, { scroll: false })
    }

    return (
        <section>
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <LuGlobe /> {data.name}
                        </div>
                        <div>
                            <ClientDropdownMenu data={data} accessToken={accessToken}>
                                <Button className="rounded-full" variant="ghost" title="Abrir menu">
                                    <HiDotsVertical />
                                </Button>
                            </ClientDropdownMenu>
                        </div>
                    </CardTitle>
                    {data.description && <CardDescription>{data.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                    <Tabs value={tab} onValueChange={handleTabChange}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="basic-info">
                                <LuInfo /> Informações Básicas
                            </TabsTrigger>
                            <TabsTrigger value="api">
                                <LuUnplug /> API
                            </TabsTrigger>
                        </TabsList>
                        <ClientBasicInfoTab data={data} />
                        <ClientApiTab data={data} apiKey={apiKey} />
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

export default ClientPageSection
