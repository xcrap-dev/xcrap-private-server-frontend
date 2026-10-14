"use client"

import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { type FC, useEffect, useState } from "react"
import { LuCirclePlus, LuSearch } from "react-icons/lu"
import { FaSpider } from "react-icons/fa"
import NextLink from "next/link"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { findManyScrapers, type FindManyScrapersResponse } from "@/services/api/scrapers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { useDebounce } from "@/hooks/use-debounce"
import formatDateTime from "@/utils/format-date-time"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/i18n"

type Props = {
    initialData: FindManyScrapersResponse
    accessToken: string
}

const ScrapersListSection: FC<Props> = ({ initialData, accessToken }) => {
    const { t } = useI18n()
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentPage = Number(searchParams.get("page")) || initialData?.meta?.currentPage || 1
    const [search, setSearch] = useState(searchParams.get("name") || "")
    const debouncedSearch = useDebounce(search, 400)

    // Sempre reseta para a página 1 ao alterar o termo de busca
    useEffect(() => {
        const currentParam = searchParams.get("name") || ""
        if (debouncedSearch !== currentParam) {
            const params = new URLSearchParams(searchParams.toString())
            if (debouncedSearch.trim()) {
                params.set("name", debouncedSearch.trim())
            } else {
                params.delete("name")
            }
            params.set("page", "1")
            router.replace(`?${params.toString()}`)
        }
    }, [debouncedSearch, router, searchParams])

    const { data: queryData, isFetching } = useQuery<FindManyScrapersResponse>({
        queryKey: ["scrapers", { page: currentPage, name: debouncedSearch }],
        queryFn: () => findManyScrapers({ page: currentPage, name: debouncedSearch }, accessToken),
        placeholderData: (previousData) => previousData,
        initialData:
            currentPage === (initialData?.meta?.currentPage || 1) && !debouncedSearch ? initialData : undefined,
    })

    const data = queryData || initialData
    const scrapers = data?.data || []
    const meta = data?.meta || { total: scrapers.length, lastPage: 1, currentPage: 1, perPage: 10, prev: null, next: null }

    const lastPage = meta.lastPage
    const hasNextPage = currentPage < lastPage
    const hasPreviousPage = currentPage > 1

    const handlePageChange = (page: number) => {
        if (page === currentPage || page < 1 || page > lastPage) return

        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`?${params.toString()}`)
    }

    const renderPaginationItems = () => {
        const items = []
        const maxVisiblePages = data.meta.perPage

        if (lastPage <= maxVisiblePages) {
            for (let i = 1; i <= lastPage; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={i === currentPage}
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(i)
                            }}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>,
                )
            }
        } else {
            const startPage = Math.max(1, currentPage - 2)
            const endPage = Math.min(lastPage, currentPage + 2)

            if (startPage > 1) {
                items.push(
                    <PaginationItem key={1}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(1)
                            }}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>,
                )

                if (startPage > 2) {
                    items.push(
                        <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                        </PaginationItem>,
                    )
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={i === currentPage}
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(i)
                            }}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>,
                )
            }

            if (endPage < lastPage) {
                if (endPage < lastPage - 1) {
                    items.push(
                        <PaginationItem key="ellipsis-end">
                            <PaginationEllipsis />
                        </PaginationItem>,
                    )
                }

                items.push(
                    <PaginationItem key={lastPage}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(lastPage)
                            }}
                        >
                            {lastPage}
                        </PaginationLink>
                    </PaginationItem>,
                )
            }
        }

        return items
    }

    return (
        <section className="pb-4">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
                    <CardTitle className="flex gap-2 items-center text-lg">
                        <FaSpider className="w-5 h-5 text-primary" /> {t("scrapers.listTitle")}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full sm:w-64">
                            <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t("scrapers.searchPlaceholder")}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        {scrapers.length > 0 ? (
                            <>
                                <Table>
                                    <TableCaption>
                                        {meta.total > 0
                                            ? t("common.showingItems", { count: scrapers.length, total: data.meta.total })
                                            : t("common.showingAllItems")}
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>{t("scrapers.tableName")}</TableHead>
                                            <TableHead>{t("scrapers.tableCreatedAt")}</TableHead>
                                            <TableHead>{t("scrapers.tableUpdatedAt")}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scrapers.map((scraper) => (
                                            <TableRow key={scraper.id}>
                                                <TableCell className="font-medium">
                                                    <NextLink href={`/scrapers/${scraper.id}`}>{scraper.name}</NextLink>
                                                </TableCell>
                                                <TableCell>
                                                    <NextLink href={`/scrapers/${scraper.id}`}>
                                                        {formatDateTime(scraper.createdAt)}
                                                    </NextLink>
                                                </TableCell>
                                                <TableCell>
                                                    <NextLink href={`/scrapers/${scraper.id}`}>
                                                        {formatDateTime(scraper.updatedAt)}
                                                    </NextLink>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {lastPage > 1 && (
                                    <div className="mt-4">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => {
                                                             e.preventDefault()
                                                             if (hasPreviousPage) {
                                                                 handlePageChange(currentPage - 1)
                                                             }
                                                         }}
                                                         className={!hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                                                     />
                                                 </PaginationItem>
                                                 {renderPaginationItems()}
                                                 <PaginationItem>
                                                     <PaginationNext
                                                         href="#"
                                                         onClick={(e) => {
                                                             e.preventDefault()
                                                             if (hasNextPage) {
                                                                 handlePageChange(currentPage + 1)
                                                             }
                                                         }}
                                                         className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                                                     />
                                                 </PaginationItem>
                                             </PaginationContent>
                                         </Pagination>
                                     </div>
                                 )}
                             </>
                         ) : (
                             <div className="py-12 text-center space-y-3 border border-dashed rounded-lg">
                                 <FaSpider className="w-10 h-10 text-muted-foreground/60 mx-auto" />
                                 <div className="space-y-1">
                                     <Typography.H4>
                                         {search ? t("scrapers.emptyFilteredTitle") : t("scrapers.emptyTitle")}
                                     </Typography.H4>
                                     <Typography.Muted>
                                         {search
                                             ? t("scrapers.emptyFilteredDesc", { search })
                                             : t("scrapers.emptyDesc")}
                                     </Typography.Muted>
                                 </div>
                                 {search ? (
                                     <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                                         {t("common.clearSearch")}
                                     </Button>
                                 ) : (
                                     <Button asChild size="sm">
                                         <NextLink href="/scrapers/create">
                                             <LuCirclePlus className="w-4 h-4 mr-1.5" /> {t("scrapers.createFirst")}
                                         </NextLink>
                                     </Button>
                                 )}
                             </div>
                         )}
                     </div>
                 </CardContent>
             </Card>
         </section>
    )
}

export default ScrapersListSection
