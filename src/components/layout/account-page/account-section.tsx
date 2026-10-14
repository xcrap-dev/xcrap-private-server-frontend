"use client"

import { LuPencil, LuPlug, LuUser } from "react-icons/lu"
import { FC, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import * as jwt from "jsonwebtoken"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ApiKeyManager from "@/components/features/account-page/api-key-manager"
import { findOneUser, FindOneUserResponse } from "@/services/api/users"
import { Typography } from "@/components/ui/typography"
import formatDateTime from "@/utils/format-date-time"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/i18n"

const AccountSection: FC = () => {
    const { t } = useI18n()
    const { data: session, status } = useSession()
    const data = session && session.accessToken ? jwt.decode(session.accessToken) : null
    const [user, setUser] = useState<FindOneUserResponse | null>(null)

    const handleClickOnEditButton = () => {}

    useEffect(() => {
        if (!data || !session || !session.accessToken) return

        const findUser = async () => {
            const user = await findOneUser(data.sub as string, session.accessToken!)
            setUser(user)
        }

        findUser()
    }, [data])

    return (
        <section>
            {session && status === "authenticated" ? (
                <>
                    <Typography.H1>{t("account.title")}</Typography.H1>
                    <Typography.Muted className="mt-4">
                        {t("account.loggedInAs")}{" "}
                        <Typography.Code>{session.user.name}</Typography.Code> ({session.user.email}).
                    </Typography.Muted>
                    {user && (
                        <div className="mt-8 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <div className="flex gap-1 items-center">
                                            <LuUser /> {t("account.userInfo")}
                                        </div>
                                        <div>
                                            <Button
                                                variant="ghost"
                                                className="rounded-full"
                                                title={t("account.edit")}
                                                onClick={handleClickOnEditButton}
                                            >
                                                <LuPencil />
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-x-2 gap-y-6">
                                    <div className="space-y-4">
                                        <Label>{t("account.fullName")}</Label>
                                        <Typography.Muted className="text-sm">{user.name}</Typography.Muted>
                                    </div>
                                    <div className="space-y-4">
                                        <Label asChild>
                                            <p>{t("account.role")}</p>
                                        </Label>
                                        <Typography.Muted className="text-sm">{user.role}</Typography.Muted>
                                    </div>
                                    <div className="space-y-4">
                                        <Label>{t("common.createdAt")}</Label>
                                        <Typography.Muted className="text-sm">
                                            {formatDateTime(user.createdAt)}
                                        </Typography.Muted>
                                    </div>
                                    <div className="space-y-4">
                                        <Label>{t("common.updatedAt")}</Label>
                                        <Typography.Muted className="text-sm">
                                            {formatDateTime(user.updatedAt)}
                                        </Typography.Muted>
                                    </div>
                                    <div className="space-y-4">
                                        <Label>{t("account.email")}</Label>
                                        <Typography.Muted className="text-sm">{user.email}</Typography.Muted>
                                    </div>
                                    <div className="space-y-4">
                                        <Label>{t("account.username")}</Label>
                                        <Typography.Muted className="text-sm">@{user.username}</Typography.Muted>
                                    </div>
                                    <div className="space-y-4">
                                        <Label asChild>
                                            <p>{t("common.id")}</p>
                                        </Label>
                                        <Typography.Muted className="text-sm">{user.id}</Typography.Muted>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex gap-1 items-center">
                                        <LuPlug /> {t("account.apiKeySection")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ApiKeyManager
                                        apiKey={user.apiKey}
                                        onRegenerate={async () => window.location.reload()}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </>
            ) : (
                <Typography.P>Deslogado</Typography.P>
            )}
        </section>
    )
}

export default AccountSection
