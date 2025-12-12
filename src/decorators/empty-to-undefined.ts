import { Transform } from "class-transformer"

export function EmptyToUndefined() {
    return Transform(({ value }) => {
        if (value.trim() === "") return undefined
        return value
    })
}