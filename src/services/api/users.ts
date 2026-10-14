import { CreateUserDto } from "@/dto/users/create-user"
import { api } from "."

export interface FindOneUserResponse {
    apiKey: string
    id: string
    role: string
    name: string
    createdAt: string
    updatedAt: string
    email: string
    username: string
}

export async function createUser(data: CreateUserDto, accessToken: string) {
    const response = await api.post<FindOneUserResponse>("/users", data, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return response.data
}

export async function findOneUser(id: string, accessToken: string) {
    const response = await api.get<FindOneUserResponse>(`/users/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return response.data
}

export interface FindManyUsersMeta {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
}

export interface FindManyUsersResponse {
    data: FindOneUserResponse[]
    meta: FindManyUsersMeta
}

export type FindManyUsersOptions = {
    page?: number
    perPage?: number
    name?: string
}

export async function findManyUsers(
    { page, perPage, name }: FindManyUsersOptions = {},
    accessToken: string,
) {
    const response = await api.get<FindManyUsersResponse>("/users", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            page,
            perPage,
            ...(name?.trim() ? { name: name.trim() } : {}),
        },
    })

    return response.data
}

export async function deleteUser(id: string, accessToken: string) {
    const response = await api.delete<void>(`/users/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return response.data
}
