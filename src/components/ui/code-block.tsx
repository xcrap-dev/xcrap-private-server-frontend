"use client"

import { type FC, useMemo, useState } from "react"
import { LuCheck, LuCopy } from "react-icons/lu"
import { toast } from "sonner"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/themes/prism-tomorrow.css"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
    code: string
    language?: "typescript" | "javascript" | "bash" | "json" | string
    fileName?: string
    className?: string
}

const CodeBlock: FC<Props> = ({ code, language = "typescript", fileName, className }) => {
    const [copied, setCopied] = useState(false)

    const highlightedCode = useMemo(() => {
        const grammar = Prism.languages[language] || Prism.languages.typescript
        return Prism.highlight(code.trim(), grammar, language)
    }, [code, language])

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code.trim())
        setCopied(true)
        toast.success("Código copiado para a Área de Transferência!")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div
            className={cn(
                "relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 text-neutral-100",
                className,
            )}
        >
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/90 text-xs font-mono text-neutral-400">
                <span>{fileName || language}</span>
                <Button
                    variant="ghost"
                    size="xs"
                    type="button"
                    onClick={handleCopy}
                    className="h-6 px-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center gap-1.5"
                >
                    {copied ? (
                        <>
                            <LuCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copiado!</span>
                        </>
                    ) : (
                        <>
                            <LuCopy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                        </>
                    )}
                </Button>
            </div>
            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed !bg-transparent !m-0">
                <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
        </div>
    )
}

export default CodeBlock
