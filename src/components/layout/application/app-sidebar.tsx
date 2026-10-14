"use client"

import { LuUser, LuChevronUp, LuGlobe, LuPlus, LuUsers, LuUserPlus } from "react-icons/lu"
import { signOut, useSession } from "next-auth/react"
import { FaSpider } from "react-icons/fa"
import { FC } from "react"

import Link from "next/link"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CreateUserDialog from "@/components/users-page/create-user-dialog"
import logoSquareDarkSvg from "../../../../public/assets/images/xcrap-logo-square.svg"
import logoDarkSvg from "../../../../public/assets/images/xcrap-logo-dark.svg"

const scraperItems = [
    {
        title: "Criar Scraper",
        url: "/scrapers/create",
        icon: LuPlus,
    },
    {
        title: "Lista de Scrapers",
        url: "/scrapers",
        icon: FaSpider,
    },
]

const clientItems = [
    {
        title: "Criar Cliente",
        url: "/clients/create",
        icon: LuPlus,
    },
    {
        title: "Lista de Clientes",
        url: "/clients",
        icon: LuGlobe,
    },
]

const adminItems = [
    {
        title: "Criar Usuário",
        icon: LuUserPlus,
        isDialog: true,
    },
    {
        title: "Lista de Usuários",
        url: "/admin/users/",
        icon: LuUsers,
    },
]

const AppSidebar: FC = () => {
    const { data: session, status } = useSession()
    const { open } = useSidebar()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu className="py-4 flex items-center justify-start">
                    {open ? (
                        <img
                            src={logoDarkSvg.src}
                            alt="Xcrap - Logo Completa"
                            className="h-6 w-auto object-contain transition-opacity duration-300 invert dark:invert-0"
                        />
                    ) : (
                        <img
                            src={logoSquareDarkSvg.src}
                            alt="Xcrap - Ícone"
                            className="h-8 w-8 object-contain transition-transform duration-300 invert dark:invert-0"
                        />
                    )}
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Clientes</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {clientItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Scrapers</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {scraperItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Admin</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {adminItems.map((item) => {
                                if (item.isDialog) {
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <CreateUserDialog>
                                                <SidebarMenuButton tooltip={item.title}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            </CreateUserDialog>
                                        </SidebarMenuItem>
                                    )
                                }

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild tooltip={item.title}>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {status === "loading" || !session ? (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <LuUser /> Carregando...
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                ) : (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <LuUser className="mr-2" />
                                        {session.user?.name || session.user?.email || "Usuário"}
                                        <LuChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                    <DropdownMenuItem asChild>
                                        <Link href="/account">Conta</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        <span>Sair</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
