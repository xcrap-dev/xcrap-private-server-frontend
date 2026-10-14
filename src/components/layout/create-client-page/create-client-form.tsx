"use client"

import { useRouter } from "next/navigation"
import { LuPlus } from "react-icons/lu"
import { FC, useState } from "react"
import { toast } from "sonner"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import useCreateClientForm from "@/hooks/forms/use-create-client-form"
import { CreateClientDto } from "@/dto/clients/create-client"
import { renderClientType } from "@/utils/render-client-type"
import { createClient } from "../../../services/api/clients"
import { ClientType } from "@/enums/clients/client-type"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Spinner from "../../ui/spinner"
import { useI18n } from "@/i18n"

type Props = {
    accessToken: string
}

const CreateClientForm: FC<Props> = ({ accessToken }) => {
    const { t } = useI18n()
    const router = useRouter()
    const form = useCreateClientForm()
    const [isFetching, setIsFething] = useState(false)

    const onSubmit = async (data: CreateClientDto) => {
        setIsFething(true)

        try {
            toast.info(t("createClient.creatingToast", { name: data.name }))
            const createdClient = await createClient(data, accessToken)
            toast.success(t("createClient.createSuccess"))
            router.push(`/clients/${createdClient.id}`)
        } catch (error) {
            console.error("Error when trying create client:", error)
            toast.error(t("createClient.createError"))
        } finally {
            setIsFething(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-2 gap-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("createClient.nameLabel")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("createClient.namePlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("createClient.typeLabel")}</FormLabel>
                            <FormControl>
                                <Select {...field} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t("createClient.typePlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(ClientType).map((clientType) => (
                                            <SelectItem value={clientType} key={clientType}>
                                                {renderClientType(clientType)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel>{t("createClient.descLabel")}</FormLabel>
                            <FormControl>
                                <Textarea placeholder={t("createClient.descPlaceholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="col-span-2">
                    <Button
                        type="submit"
                        className={`${isFetching ? "animate-pulse" : ""} flex gap-1 items-center`}
                        disabled={isFetching}
                    >
                        {isFetching ? (
                            <>
                                <Spinner />
                                {t("createClient.submittingButton")}
                            </>
                        ) : (
                            <>
                                <LuPlus /> {t("createClient.submitButton")}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateClientForm
