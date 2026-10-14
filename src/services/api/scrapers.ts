import { ExecuteScraperDto } from "../../dto/scrapers/execute-scraper"
import { UpdateScraperDto } from "../../dto/scrapers/update-scraper"
import { CreateScraperDto } from "../../dto/scrapers/create-scraper"
import { api } from "."

interface Owner {
    id: string
    name: string
    username: string
}

interface Client {
    id: string
    name: string
    type: string
}

interface CreateScraperResponse {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    defaultUrl: string | null
    description: string | null
    ownerId: string
    owner: Owner
    clientId: string
    client: Client
    parsingModel: ParsingModel
}

export async function createScraper(data: CreateScraperDto, accessToken: string) {
    const response = await api.post<CreateScraperResponse>("/scrapers", data, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return response.data
}

export interface FindOneScraperResponse {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    defaultUrl: string | null
    description: string | null
    ownerId: string
    owner: Owner
    clientId: string
    client: Client
    parsingModel: ParsingModel
}

export interface ParsingModel {
    type: string
    model: Model
}

interface Model {
    [key: string]: Field
}

interface Field {
    query?: string
    extractor?: string
    default?: string
    nested?: Nested
}

interface Nested {
    type: string
    model: Model
}

export async function findOneScraper(id: string, accessToken: string) {
    const response = await api.get<FindOneScraperResponse>(`/scrapers/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return response.data
}

interface UpdateScraperResponse {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    defaultUrl: string | null
    description: string | null
    ownerId: string
    owner: Owner
    clientId: string
    client: Client
    parsingModel: ParsingModel
}

export async function updateScraper(id: string, data: UpdateScraperDto, accessToken: string) {
    const response = await api.put<UpdateScraperResponse>(`/scrapers/${id}`, data, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return response.data
}

export async function deleteScraper(id: string, accessToken: string) {
    await api.delete(`/scrapers/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
}

export interface FindManyScrapersResponse {
    data: FindManyScraperItem[]
    meta: Meta
}

interface FindManyScraperItem {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    defaultUrl: string
    description: string
    ownerId: string
    owner: Owner
    clientId: string
    client: Client
    parsingModel: ParsingModel
}

interface Meta {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
}

export interface FindManyScrapersOptions {
    page?: number
    perPage?: number
    name?: string
}

export async function findManyScrapers(
    { page, perPage, name }: FindManyScrapersOptions = {},
    accessToken: string,
) {
    const response = await api.get<FindManyScrapersResponse>("/scrapers", {
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

export interface ExecuteOneScraperResponse<T extends any> {
    readonly metadata: Metadata
    readonly data: T
}

interface Metadata {
    request: Request
    response: Response
    parsing: Parsing
}

interface Request {
    url: string
    startTime: number
    endTime: number
    duration: number
    hadRetries: boolean
    attempts: number
    userAgent: string
}

interface Response {
    status: number
    statusText: string
    contentType: string
}

interface Parsing {
    startTime: number
    endTime: number
    duration: number
}

export async function executeOneScraper<T extends any>(id: string, data: ExecuteScraperDto, accessToken: string) {
    const response = await api.post<ExecuteOneScraperResponse<T>>(`/scrapers/${id}/execute`, data, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return response.data
}

export async function executeOneDynamicScraper<T extends any>(id: string, data: any, accessToken: string) {
    const response = await api.post<ExecuteOneScraperResponse<T>>(`/scrapers/${id}/execute`, data, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    return response.data
}
