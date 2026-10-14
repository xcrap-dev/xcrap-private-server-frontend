"use client"

import { useFormContext } from "react-hook-form"
import { type FC, type KeyboardEvent, memo, useEffect, useState } from "react"
import dynamic from "next/dynamic"

import { LuBraces, LuBrackets, LuChevronDown, LuChevronRight, LuLayers, LuTrash } from "react-icons/lu"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ParsingModelFieldType } from "@/enums/scrapers/parsing-model-field-type"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CreateScraperDto } from "@/dto/scrapers/create-scraper"
import { getExtractorName } from "@/utils/get-extractor-name"
import { getExtractorIcon } from "@/utils/get-extractor-icon"
import { Typography } from "@/components/ui/typography"
import { Extractor } from "@/enums/scrapers/extractor"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const ParsingModelBuilder = dynamic(() => import("./parsing-model-builder"), {
    ssr: false,
})

type Props = {
    id: string
    path: string
    name: string
    collapseSignal?: { collapsed: boolean; version: number } | null
    onRemove: (id: string, name: string) => void
    onRename: (id: string, oldName: string, newName: string) => boolean | void
}

const ParsingModelField: FC<Props> = memo(({ id, path, name, collapseSignal, onRemove, onRename }) => {
    const form = useFormContext<CreateScraperDto>()
    const [localName, setLocalName] = useState(name)
    const [hasNested, setHasNested] = useState<boolean>(() => !!form.getValues(`${path}.nested` as any))

    useEffect(() => {
        setLocalName(name)
    }, [name])

    useEffect(() => {
        setHasNested(!!form.getValues(`${path}.nested` as any))
    }, [path, form])

    const handleAddNested = () => {
        form.setValue(`${path}.nested` as any, {
            type: ParsingModelFieldType.HTML,
            query: "",
            model: {},
        })
        setHasNested(true)
    }

    const handleRemoveNested = () => {
        const confirmDelete = window.confirm("Você tem certeza que deseja remover o alinhamento deste campo?")
        if (!confirmDelete) return

        form.unregister(`${path}.nested` as any)
        const currentField = { ...((form.getValues(path as any) as Record<string, any>) || {}) }
        delete currentField.nested
        form.setValue(path as any, currentField)
        setHasNested(false)
    }

    const handleCommitRename = () => {
        const trimmed = localName.trim()
        if (!trimmed || trimmed === name) {
            setLocalName(name)
            return
        }
        const success = onRename(id, name, trimmed)
        if (success === false) {
            setLocalName(name)
        }
    }

    const handleKeyDownName = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault()
            event.currentTarget.blur()
        }
    }

    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        if (collapseSignal) {
            setIsOpen(!collapseSignal.collapsed)
        }
    }, [collapseSignal])

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <Card>
                <CardHeader className="py-3">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <Button
                                variant="ghost"
                                size="xs"
                                type="button"
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                title={isOpen ? "Recolher campo" : "Expandir campo"}
                            >
                                {isOpen ? (
                                    <LuChevronDown className="h-4 w-4" />
                                ) : (
                                    <LuChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                            <Label htmlFor={`field-${id}-name-input`} className="whitespace-nowrap text-xs">
                                Nome *:
                            </Label>
                            <Input
                                id={`field-${id}-name-input`}
                                size="xs"
                                placeholder="nome_do_campo"
                                value={localName}
                                onChange={(e) => setLocalName(e.target.value)}
                                onBlur={handleCommitRename}
                                onKeyDown={handleKeyDownName}
                                className="max-w-48"
                            />
                            {!isOpen && (
                                <span className="hidden md:inline-flex text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded truncate max-w-66">
                                    {form.getValues(`${path}.query` as any) || "sem query"}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2 items-center">
                        {hasNested && (
                            <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                <LuLayers className="w-3 h-3" />
                                Alinhado
                            </Badge>
                        )}
                        <FormField
                            control={form.control}
                            name={`${path}.multiple` as any}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <button
                                            type="button"
                                            onClick={() => field.onChange(!field.value)}
                                            className="cursor-pointer select-none"
                                        >
                                            <Badge
                                                title={field.value ? "Trocar para único" : "Trocar para múltiplo"}
                                                variant={field.value ? "default" : "outline"}
                                                className="flex items-center"
                                            >
                                                {field.value ? (
                                                    <>
                                                        <LuBrackets />
                                                        Múltiplo
                                                    </>
                                                ) : (
                                                    <>
                                                        <LuBraces />
                                                        Único
                                                    </>
                                                )}
                                            </Badge>
                                        </button>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            variant="ghost"
                            type="button"
                            className="rounded-full text-red-400 hover:text-red-500 transition-colors duration-300"
                            size="xs"
                            onClick={() => onRemove(id, name)}
                        >
                            <LuTrash />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CollapsibleContent>
                <CardContent className="grid grid-cols-2 gap-x-2 gap-y-6">
                <FormField
                    control={form.control}
                    name={`${path}.query` as any}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Query {hasNested ? "*" : "(opcional)"}</FormLabel>
                            <FormControl>
                                <Input placeholder="#element" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${path}.extractor` as any}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Extrator (opcional)</FormLabel>
                            <FormControl>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione um Extrator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Extratores</SelectLabel>
                                            {Object.values(Extractor).map((extractor) => (
                                                <SelectItem value={extractor} key={extractor}>
                                                    {getExtractorIcon(extractor)} {getExtractorName(extractor)}
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
                    name={`${path}.default` as any}
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>Valor padrão (opcional)</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-24" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {hasNested ? (
                    <div className="col-span-2 space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                                    <LuLayers className="w-3 h-3" /> Alinhamento
                                </Badge>
                                <Typography.Muted>
                                    Modelo de parsing aninhado deste campo
                                </Typography.Muted>
                            </div>
                            <Button
                                size="xs"
                                variant="ghost"
                                type="button"
                                onClick={handleRemoveNested}
                                className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                                <LuTrash /> Remover alinhamento
                            </Button>
                        </div>
                        <ParsingModelBuilder basePath={`${path}.nested`} />
                    </div>
                ) : (
                    <div className="flex justify-end col-span-2">
                        <Button
                            size="xs"
                            variant="secondary"
                            type="button"
                            onClick={handleAddNested}
                        >
                            <LuLayers /> Adicionar alinhamento
                        </Button>
                    </div>
                )}
            </CardContent>
            </CollapsibleContent>
        </Card>
    </Collapsible>
)
})

ParsingModelField.displayName = "ParsingModelField"

export default ParsingModelField
