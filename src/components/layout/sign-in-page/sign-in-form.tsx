"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { FC, useState, useMemo } from "react"
import * as z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n"

type Props = React.ComponentProps<"div">

const SignInForm: FC<Props> = ({ className, ...props }) => {
    const { t } = useI18n()
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)
    const router = useRouter()

    const formSchema = useMemo(
        () =>
            z.object({
                username: z.string().email(t("auth.invalidEmail")),
                password: z.string().min(6, t("auth.passwordMinLength")),
            }),
        [t],
    )

    type FormData = z.infer<typeof formSchema>

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = async (values: FormData) => {
        setIsLoading(true)
        setLoginError(null)

        const result = await signIn("credentials", {
            ...values,
            redirect: false,
        })

        setIsLoading(false)

        if (result?.error) {
            console.error(result.error)
            setLoginError(t("auth.invalidCredentials"))
        } else {
            router.push("/scrapers")
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>{t("auth.signInTitle")}</CardTitle>
                    <CardDescription>{t("auth.signInSubtitle")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("auth.usernameLabel")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t("auth.usernamePlaceholder")}
                                                    type="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("auth.passwordLabel")}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="••••••••" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                                <div className="flex flex-col gap-3">
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? t("auth.submitting") : t("auth.submitButton")}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignInForm
