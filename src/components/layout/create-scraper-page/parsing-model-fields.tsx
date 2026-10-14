"use client"

import { useFormContext } from "react-hook-form"
import { LuChevronDown, LuChevronUp, LuPlus } from "react-icons/lu"
import { type FC, useCallback, useState } from "react"
import { toast } from "sonner"

import { CreateScraperDto } from "@/dto/scrapers/create-scraper"
import { Extractor } from "@/enums/scrapers/extractor"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import ParsingModelField from "./parsing-model-field"
import { Button } from "@/components/ui/button"

interface FieldItem {
    id: string
    name: string
}

type Props = {
    basePath: string
}

const ParsingModelFields: FC<Props> = ({ basePath }) => {
    const form = useFormContext<CreateScraperDto>()

    const [fields, setFields] = useState<FieldItem[]>(() => {
        const initialModel = (form.getValues(basePath as any) as Record<string, any>) || {}
        return Object.keys(initialModel).map((name) => ({
            id: crypto.randomUUID(),
            name,
        }))
    })

    const hasFields = fields.length > 0

    const addField = useCallback(() => {
        setFields((prev) => {
            const existingNames = new Set(prev.map((f) => f.name))
            let index = prev.length
            while (existingNames.has(`field_${index}`)) {
                index++
            }
            const name = `field_${index}`
            const id = crypto.randomUUID()

            form.setValue(`${basePath}.${name}` as any, {
                query: "",
                extractor: Extractor.InnerText,
                multiple: false,
            })

            return [...prev, { id, name }]
        })
    }, [basePath, form])

    const removeField = useCallback(
        (id: string, name: string) => {
            const confirmDelete = window.confirm(`Você tem certeza que deseja apagar o campo '${name}'?`)
            if (!confirmDelete) return

            const currentModel = { ...((form.getValues(basePath as any) as Record<string, any>) || {}) }
            delete currentModel[name]
            form.setValue(basePath as any, currentModel)
            form.unregister(`${basePath}.${name}` as any)

            setFields((prev) => prev.filter((f) => f.id !== id))
        },
        [basePath, form],
    )

    const renameField = useCallback(
        (id: string, oldName: string, newName: string) => {
            if (!newName || oldName === newName) return false

            const currentModel = (form.getValues(basePath as any) as Record<string, any>) || {}
            if (currentModel[newName] !== undefined) {
                toast.error(`O campo '${newName}' já existe.`)
                return false
            }

            const value = form.getValues(`${basePath}.${oldName}` as any) || {
                query: "",
                extractor: Extractor.InnerText,
                multiple: false,
            }

            const orderedEntries = Object.entries(currentModel).map(([key, val]) =>
                key === oldName ? [newName, value] : [key, val],
            )
            const reorderedObject = Object.fromEntries(orderedEntries)

            form.setValue(basePath as any, reorderedObject)
            form.unregister(`${basePath}.${oldName}` as any)
            form.clearErrors(`${basePath}.${oldName}` as any)

            setFields((prev) => prev.map((f) => (f.id === id ? { ...f, name: newName } : f)))
            return true
        },
        [basePath, form],
    )

    const [collapseSignal, setCollapseSignal] = useState<{ collapsed: boolean; version: number } | null>(null)

    const handleCollapseAll = () => {
        setCollapseSignal((prev) => ({ collapsed: true, version: (prev?.version ?? 0) + 1 }))
    }

    const handleExpandAll = () => {
        setCollapseSignal((prev) => ({ collapsed: false, version: (prev?.version ?? 0) + 1 }))
    }

    return (
        <div>
            {hasFields && (
                <>
                    <div className="flex justify-between items-center mb-3">
                        <Typography.Muted className="text-xs">
                            {fields.length} {fields.length === 1 ? "campo configurado" : "campos configurados"}
                        </Typography.Muted>
                        <div className="flex gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                onClick={handleCollapseAll}
                                className="text-xs h-7 text-muted-foreground hover:text-foreground"
                            >
                                <LuChevronUp className="h-3.5 w-3.5" /> Recolher todos
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                onClick={handleExpandAll}
                                className="text-xs h-7 text-muted-foreground hover:text-foreground"
                            >
                                <LuChevronDown className="h-3.5 w-3.5" /> Expandir todos
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {fields.map((field) => (
                            <ParsingModelField
                                key={field.id}
                                id={field.id}
                                name={field.name}
                                path={`${basePath}.${field.name}`}
                                collapseSignal={collapseSignal}
                                onRemove={removeField}
                                onRename={renameField}
                            />
                        ))}
                    </div>
                    <Separator className="my-6" />
                </>
            )}
            <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={addField}
                className="mt-4"
            >
                <LuPlus /> Adicionar um campo
            </Button>
        </div>
    )
}

export default ParsingModelFields
