"use client"

import { LuCirclePlus } from "react-icons/lu"
import { FC } from "react"

import { Typography } from "@/components/ui/typography"
import CreateUserDialog from "./create-user-dialog"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"

const UsersPageTopSection: FC = () => {
    const { t } = useI18n()

    return (
        <section className="pb-4">
            <div className="flex items-center justify-between">
                <Typography.H1>{t("users.title")}</Typography.H1>
                <CreateUserDialog>
                    <Button size="sm">
                        <LuCirclePlus />
                        {t("users.createUser")}
                    </Button>
                </CreateUserDialog>
            </div>
            <Typography.Muted className="mt-4 text-sm">{t("users.description")}</Typography.Muted>
        </section>
    )
}

export default UsersPageTopSection
