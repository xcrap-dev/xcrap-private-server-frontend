import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import * as jwt from "jsonwebtoken"

import { findOneUser, FindOneUserResponse } from "@/services/api/users"

function decodeToken(token: string): { sub?: string; email?: string } | null {
    try {
        const decoded = jwt.decode(token) as { sub?: string; email?: string } | null
        if (decoded?.sub) return decoded
    } catch {
        // Fallback to manual payload decoding if jwt.decode fails in certain browser environments
    }

    try {
        const parts = token.split(".")
        if (parts.length === 3) {
            const base64Url = parts[1]
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            )
            return JSON.parse(jsonPayload)
        }
    } catch {
        // Ignore fallback error
    }

    return null
}

export function useCurrentUserApiKey(explicitAccessToken?: string) {
    const { data: session } = useSession()
    const token = explicitAccessToken || session?.accessToken

    const query = useQuery<FindOneUserResponse | null>({
        queryKey: ["current-user-api-key", token],
        queryFn: async () => {
            if (!token) return null

            try {
                const decoded = decodeToken(token)
                const userId = decoded?.sub
                if (!userId) return null

                return await findOneUser(userId, token)
            } catch (err) {
                console.error("Error fetching user apiKey:", err)
                return null
            }
        },
        enabled: !!token,
        staleTime: 1000 * 60 * 10,
    })

    return {
        ...query,
        apiKey: query.data?.apiKey,
        user: query.data,
    }
}

