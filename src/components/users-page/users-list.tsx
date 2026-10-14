"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { LuCopy, LuKey, LuSearch, LuShield, LuTrash, LuUser, LuUserPlus, LuUsers } from "react-icons/lu"
import { useRouter, useSearchParams } from "next/navigation"
import { type FC, useEffect, useState } from "react"
import { HiDotsVertical } from "react-icons/hi"
import { toast } from "sonner"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteUser, findManyUsers, FindManyUsersResponse, FindOneUserResponse } from "@/services/api/users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDebounce } from "@/hooks/use-debounce"
import CreateUserDialog from "./create-user-dialog"
import { Typography } from "@/components/ui/typography"
import formatDateTime from "@/utils/format-date-time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type Props = {
    initialData: FindManyUsersResponse
    accessToken: string
}

const UsersListSection: FC<Props> = ({ initialData, accessToken }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const queryClient = useQueryClient()
    const [search, setSearch] = useState(searchParams.get("name") || "")
    const debouncedSearch = useDebounce(search, 400)
    const [userToDelete, setUserToDelete] = useState<FindOneUserResponse | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const currentPage = Number(searchParams.get("page")) || initialData?.meta?.currentPage || 1

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

    const { data: queryData, isFetching } = useQuery<FindManyUsersResponse>({
        queryKey: ["users", { page: currentPage, name: debouncedSearch }],
        queryFn: () => findManyUsers({ page: currentPage, name: debouncedSearch }, accessToken),
        placeholderData: (previousData) => previousData,
        initialData:
            currentPage === (initialData?.meta?.currentPage || 1) && !debouncedSearch ? initialData : undefined,
    })

    const data = queryData || initialData
    const users = data?.data || []

    const meta = data?.meta || { currentPage: 1, lastPage: 1, total: users.length, perPage: 10 }
    const lastPage = meta.lastPage
    const hasNextPage = currentPage < lastPage
    const hasPreviousPage = currentPage > 1

    const handlePageChange = (page: number) => {
        if (page === currentPage || page < 1 || page > lastPage) return

        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`?${params.toString()}`)
    }

    const handleCopy = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success(`${label} copiado para a Área de Transferência.`)
        } catch {
            toast.error(`Erro ao copiar ${label.toLowerCase()}.`)
        }
    }

    const handleDeleteUser = async () => {
        if (!userToDelete) return

        setIsDeleting(true)
        try {
            await deleteUser(userToDelete.id, accessToken)
            toast.success(`Usuário "${userToDelete.name}" excluído com sucesso!`)

            queryClient.invalidateQueries({ queryKey: ["users"] })
            router.refresh()
            setUserToDelete(null)
        } catch (error: any) {
            console.error("Erro ao excluir usuário:", error)
            const message = error?.response?.data?.message || "Não foi possível excluir o usuário."
            toast.error(message)
        } finally {
            setIsDeleting(false)
        }
    }

    const renderPaginationItems = () => {
        const items = []
        const maxVisiblePages = meta.perPage || 10

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
                    items.push(<PaginationEllipsis key="ellipsis-start" />)
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
                    items.push(<PaginationEllipsis key="ellipsis-end" />)
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
        <section className="space-y-4 pb-6">
            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
                    <CardTitle className="flex gap-2 items-center text-lg">
                        <LuUsers className="w-5 h-5 text-primary" /> Lista de Usuários
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full sm:w-64">
                            <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {users.length > 0 ? (
                        <>
                            <Table>
                                <TableCaption>
                                    {meta.total > 0
                                        ? `Exibindo ${users.length} de ${meta.total} usuários cadastrados.`
                                        : "Nenhum usuário cadastrado."}
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Usuário</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>E-mail</TableHead>
                                        <TableHead>Cargo</TableHead>
                                        <TableHead>Criado em</TableHead>
                                        <TableHead className="w-[80px] text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => {
                                        const initials = user.name
                                            ? user.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .slice(0, 2)
                                                    .join("")
                                                    .toUpperCase()
                                            : "U"

                                        return (
                                            <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                                                <TableCell>
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="text-xs font-medium">
                                                                {initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-sm leading-tight">
                                                                {user.name}
                                                            </span>
                                                            <span className="text-[11px] text-muted-foreground font-mono">
                                                                {user.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    @{user.username}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {user.email || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {user.role === "ADMIN" ? (
                                                        <Badge
                                                            variant="default"
                                                            className="font-mono text-[10px] gap-1"
                                                        >
                                                            <LuShield className="w-3 h-3" /> ADMIN
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="font-mono text-[10px]">
                                                            {user.role || "USER"}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {formatDateTime(user.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full"
                                                                title="Ações"
                                                            >
                                                                <HiDotsVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuLabel>Ações do Usuário</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleCopy(user.id, "ID do Usuário")}
                                                            >
                                                                <LuCopy className="mr-2 h-4 w-4" /> Copiar ID
                                                            </DropdownMenuItem>
                                                            {user.apiKey && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleCopy(user.apiKey, "Chave de API")
                                                                    }
                                                                >
                                                                    <LuKey className="mr-2 h-4 w-4" /> Copiar API Key
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() => setUserToDelete(user)}
                                                            >
                                                                <LuTrash className="mr-2 h-4 w-4" /> Excluir Usuário
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
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
                            <LuUsers className="w-10 h-10 text-muted-foreground/60 mx-auto" />
                            <div className="space-y-1">
                                <Typography.H4>
                                    {search
                                        ? "Nenhum usuário corresponde aos filtros"
                                        : "Nenhum usuário cadastrado"}
                                </Typography.H4>
                                <Typography.Muted>
                                    {search
                                        ? `Não foram encontrados resultados para a busca "${search}".`
                                        : "Cadastre novos usuários para conceder acesso ao sistema."}
                                </Typography.Muted>
                            </div>
                            {search ? (
                                <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                                    Limpar busca
                                </Button>
                            ) : (
                                <CreateUserDialog>
                                    <Button size="sm">
                                        <LuUserPlus className="w-4 h-4 mr-1.5" /> Criar primeiro usuário
                                    </Button>
                                </CreateUserDialog>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog for Deleting User */}
            <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir Usuário</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir o usuário{" "}
                            <b>{userToDelete?.name}</b> (@{userToDelete?.username})?
                            Esta ação é permanente e revogará todas as permissões e chaves de API associadas a esta conta.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isDeleting}>
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Excluindo..." : "Confirmar Exclusão"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default UsersListSection
