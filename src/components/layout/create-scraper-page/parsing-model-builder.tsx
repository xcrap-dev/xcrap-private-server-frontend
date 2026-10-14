"use client"

import { useFormContext } from "react-hook-form"
import { FC } from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ParsingModelFieldType } from "@/enums/scrapers/parsing-model-field-type"
import { getParsingModelTypeIcon } from "@/utils/get-parsing-model-type-icon"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CreateScraperDto } from "@/dto/scrapers/create-scraper"
import ParsingModelFields from "./parsing-model-fields"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

type Props = {
    basePath?: string
}

const ParsingModelBuilder: FC<Props> = ({ basePath = "parsingModel" }) => {
    const form = useFormContext<CreateScraperDto>()
    const isRootPath = basePath === "parsingModel"
    const modelState = form.getFieldState(`${basePath}.model` as any, form.formState)

    return (
        <Card>
            <CardHeader className="grid grid-cols-2 gap-x-2 gap-y-6">
                <FormField
                    control={form.control}
                    name={`${basePath}.type` as any}
                    render={({ field }) => (
                        <FormItem className={isRootPath ? "col-span-2" : ""}>
                            <FormLabel>Tipo *</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione um tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Tipos de modelo de parsing</SelectLabel>
                                            {Object.values(ParsingModelFieldType).map((type) => (
                                                <SelectItem value={type} key={type}>
                                                    {getParsingModelTypeIcon(type)} {type}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${basePath}.query` as any}
                    render={({ field }) => (
                        <FormItem className={isRootPath ? "col-span-2" : ""}>
                            <FormLabel>Query {isRootPath && "raiz"} *</FormLabel>
                            {isRootPath && (
                                <FormDescription>
                                    A query raiz é útil se você quiser trabalhar apenas com uma parte específica da
                                    página para evitar obter dados que não lhe interessam. Exemplo: `.container`,
                                    `.product`, `#profile-info`
                                </FormDescription>
                            )}
                            <FormControl>
                                <Input placeholder="#product" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <Label className="text-sm font-medium">Campos *</Label>
                    {modelState.error?.message && (
                        <p className="text-sm font-medium text-destructive">
                            {String(modelState.error.message)}
                        </p>
                    )}
                </div>
                <ParsingModelFields basePath={`${basePath}.model`} />
            </CardContent>
        </Card>
    )
}

export default ParsingModelBuilder
