"use client"

import { LuBraces, LuGlobe, LuInfo, LuPlus, LuSparkles } from "react-icons/lu"
import { useRouter, useSearchParams } from "next/navigation"
import { FC } from "react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getParsingModelTypeIcon } from "@/utils/get-parsing-model-type-icon"
import useCreateScraperForm from "@/hooks/forms/use-create-scraper-form"
import { CreateScraperDto } from "@/dto/scrapers/create-scraper"
import { useWatch, type Control } from "react-hook-form"
import { Typography } from "@/components/ui/typography"
import ClientSelectorDialog from "./client-selector-dialog"
import ParsingModelBuilder from "./parsing-model-builder"
import OutputExampleTab from "./output-example-tab"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/i18n"

type Props = {
    accessToken: string
}

const RootParsingModelTypeBadge: FC<{ control: Control<CreateScraperDto> }> = ({ control }) => {
    const type = useWatch({
        control,
        name: "parsingModel.type",
    })

    return (
        <Badge variant="outline">
            {getParsingModelTypeIcon(type)} {type}
        </Badge>
    )
}

const CreateScraperForm: FC<Props> = ({ accessToken }) => {
    const { t } = useI18n()
    const router = useRouter()
    const searchParams = useSearchParams()
    const tab = searchParams.get("tab") || "basic-info"
    const form = useCreateScraperForm()

    const handleTabChange = (newTab: string) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()))
        params.set("tab", newTab)
        router.replace(`?${params.toString()}`, { scroll: false })
    }

    const onSubmit = (data: CreateScraperDto) => {
        console.log(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic-info" value={tab} onValueChange={handleTabChange}>
                    <TabsList>
                        <TabsTrigger value="basic-info">
                            <LuInfo /> {t("createScraper.tabBasicInfo")}
                        </TabsTrigger>
                        <TabsTrigger value="parsing-model">
                            <LuBraces /> {t("createScraper.tabParsingModel")}
                        </TabsTrigger>
                        <TabsTrigger value="output-example">
                            <LuSparkles /> {t("createScraper.tabOutputExample")}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic-info" className="grid grid-cols-2 gap-x-2 gap-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("createScraper.nameLabel")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("createScraper.namePlaceholder")} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="clientId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("createScraper.clientLabel")}</FormLabel>
                                    <FormControl>
                                        <ClientSelectorDialog accessToken={accessToken} {...field}>
                                            <Button variant="outline" className="overflow-hidden">
                                                {field.value ? (
                                                    <>
                                                        <LuGlobe /> {t("createScraper.clientPrefix")} #{field.value}
                                                    </>
                                                ) : (
                                                    t("createScraper.selectClient")
                                                )}
                                            </Button>
                                        </ClientSelectorDialog>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="defaultUrl"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>{t("createScraper.defaultUrlLabel")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t("createScraper.defaultUrlPlaceholder")} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>{t("createScraper.descLabel")}</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={t("createScraper.descPlaceholder")} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                    <TabsContent value="parsing-model" className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Typography.Small className="font-medium">
                                {t("createScraper.rootParsingModel")}
                            </Typography.Small>
                            <RootParsingModelTypeBadge control={form.control} />
                        </div>
                        <ParsingModelBuilder />
                        {form.formState.errors.parsingModel?.message && (
                            <Typography.Small className="text-destructive font-medium">
                                {String(form.formState.errors.parsingModel.message)}
                            </Typography.Small>
                        )}
                    </TabsContent>
                    <OutputExampleTab value="output-example" />
                </Tabs>
                <div className="col-span-2">
                    <Button>
                        <LuPlus /> {t("createScraper.submitButton")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateScraperForm
