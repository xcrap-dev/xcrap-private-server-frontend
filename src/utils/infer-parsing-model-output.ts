import { CreateParsingModelDto, CreateParsingModelFieldDto } from "@/dto/scrapers/create-scraper"
import { ParsingModel } from "@/services/api/scrapers"
import { Extractor } from "@/enums/scrapers/extractor"

export function inferFieldExampleValue(fieldName: string, field: CreateParsingModelFieldDto | any): any {
    // 1. If field has a nested parsing model
    if (field.nested && field.nested.model && Object.keys(field.nested.model).length > 0) {
        const nestedOutput = inferParsingModelOutput(field.nested)
        if (field.multiple) {
            return [nestedOutput, nestedOutput]
        }
        return nestedOutput
    }

    // 2. If default value is provided
    if (field.default !== undefined && field.default !== null && field.default !== "") {
        try {
            if (typeof field.default === "string" && (field.default.startsWith("{") || field.default.startsWith("["))) {
                const parsed = JSON.parse(field.default)
                return field.multiple && !Array.isArray(parsed) ? [parsed] : parsed
            }
        } catch {
            // Keep original string if JSON parsing fails
        }
        return field.multiple ? [field.default] : field.default
    }

    // 3. Infer value based on extractor
    let sample: any
    const extractor = field.extractor

    switch (extractor) {
        case Extractor.Href:
            sample = "https://example.com/produtos/item-1"
            break
        case Extractor.Src:
            sample = "https://example.com/images/produto.png"
            break
        case Extractor.InnerHtml:
        case Extractor.OuterHtml:
            sample = "<p>Conteúdo HTML extraído</p>"
            break
        case Extractor.ClassList:
        case Extractor.ClassNames:
            sample = ["card", "product-item", "highlight"]
            break
        case Extractor.Attrs:
        case Extractor.Attributes:
        case Extractor.RawAttrs:
        case Extractor.RawAttributes:
            sample = { id: "item-123", role: "button", "data-category": "eletronicos" }
            break
        case Extractor.Checked:
        case Extractor.Disabled:
        case Extractor.Readonly:
        case Extractor.Required:
        case Extractor.Selected:
        case Extractor.AriaHidden:
        case Extractor.AriaChecked:
        case Extractor.AriaExpanded:
        case Extractor.AriaDisabled:
            sample = true
            break
        case Extractor.ChildElementCount:
        case Extractor.MaxLength:
        case Extractor.MinLength:
            sample = 5
            break
        default: {
            const lower = fieldName.toLowerCase()
            if (lower.includes("id")) {
                sample = "1024"
            } else if (lower.includes("price") || lower.includes("preco") || lower.includes("valor")) {
                sample = "R$ 149,90"
            } else if (lower.includes("url") || lower.includes("link")) {
                sample = "https://example.com/detalhes"
            } else if (
                lower.includes("img") ||
                lower.includes("image") ||
                lower.includes("foto") ||
                lower.includes("thumbnail")
            ) {
                sample = "https://example.com/fotos/thumb.jpg"
            } else if (lower.includes("email")) {
                sample = "contato@empresa.com"
            } else if (lower.includes("date") || lower.includes("data")) {
                sample = "2026-10-14"
            } else if (
                lower.includes("author") ||
                lower.includes("autor") ||
                lower.includes("nome") ||
                lower.includes("name")
            ) {
                sample = "Exemplo Nome"
            } else if (
                lower.includes("desc") ||
                lower.includes("descricao") ||
                lower.includes("text") ||
                lower.includes("texto")
            ) {
                sample = "Descrição detalhada do elemento extraído da página..."
            } else if (lower.includes("title") || lower.includes("titulo")) {
                sample = "Título do Artigo ou Produto"
            } else if (lower.includes("rating") || lower.includes("nota") || lower.includes("score")) {
                sample = 4.8
            } else if (
                lower.includes("count") ||
                lower.includes("qtd") ||
                lower.includes("total") ||
                lower.includes("quantidade")
            ) {
                sample = 42
            } else {
                sample = `Valor de ${fieldName}`
            }
            break
        }
    }

    if (field.multiple) {
        if (Array.isArray(sample)) {
            return sample
        }
        return [sample, typeof sample === "string" ? `${sample} (2)` : sample]
    }

    return sample
}

export function inferParsingModelOutput(
    parsingModel?: CreateParsingModelDto | ParsingModel | null,
): Record<string, any> {
    if (!parsingModel || !parsingModel.model) {
        return {}
    }

    const result: Record<string, any> = {}
    for (const [key, field] of Object.entries(parsingModel.model)) {
        if (!key || !field) continue
        result[key] = inferFieldExampleValue(key, field)
    }

    return result
}
