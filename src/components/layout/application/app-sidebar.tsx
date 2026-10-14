"use client"

import { LuUser, LuChevronUp, LuGlobe, LuPlus, LuUsers, LuUserPlus } from "react-icons/lu"
import { signOut, useSession } from "next-auth/react"
import { FaSpider } from "react-icons/fa"
import { FC, useMemo } from "react"

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
import { useI18n } from "@/i18n"

const AppSidebar: FC = () => {
    const { data: session, status } = useSession()
    const { open } = useSidebar()
    const { t } = useI18n()

    const scraperItems = useMemo(
        () => [
            {
                title: t("sidebar.createScraper"),
                url: "/scrapers/create",
                icon: LuPlus,
            },
            {
                title: t("sidebar.scrapersList"),
                url: "/scrapers",
                icon: FaSpider,
            },
        ],
        [t],
    )

    const clientItems = useMemo(
        () => [
            {
                title: t("sidebar.createClient"),
                url: "/clients/create",
                icon: LuPlus,
            },
            {
                title: t("sidebar.clientsList"),
                url: "/clients",
                icon: LuGlobe,
            },
        ],
        [t],
    )

    const adminItems = useMemo(
        () => [
            {
                title: t("sidebar.createUser"),
                icon: LuUserPlus,
                isDialog: true,
            },
            {
                title: t("sidebar.usersList"),
                url: "/admin/users/",
                icon: LuUsers,
            },
        ],
        [t],
    )

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu className="py-4 flex items-center justify-start">
                    <Link href="/" className="flex items-center">
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
                    </Link>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("sidebar.clients")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {clientItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("sidebar.scrapers")}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {scraperItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>{t("sidebar.admin")}</SidebarGroupLabel>
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
                                            <Link href={item.url || "#"}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
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
                                <LuUser /> {t("sidebar.loadingUser")}
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
                                        {session.user?.name || session.user?.email || t("common.user")}
                                        <LuChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                    <DropdownMenuItem asChild>
                                        <Link href="/account">{t("sidebar.account")}</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        <span>{t("sidebar.logout")}</span>
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
