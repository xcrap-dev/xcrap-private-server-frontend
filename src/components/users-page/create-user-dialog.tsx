"use client"

import { FC, ReactNode, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCreateUserForm } from "@/hooks/forms/use-create-user-form"
import { createUser, FindOneUserResponse } from "@/services/api/users"
import { CreateUserDto } from "@/dto/users/create-user"
import { queryClient } from "@/helpers/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserRole } from "@/enums/users/role"

type Props = {
    children?: ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onSuccess?: (user: FindOneUserResponse) => void
}

const CreateUserDialog: FC<Props> = ({
    children,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    onSuccess,
}) => {
    const router = useRouter()
    const { data: session } = useSession()
    const [internalOpen, setInternalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? (setControlledOpen ?? (() => {})) : setInternalOpen

    const form = useCreateUserForm()

    const onSubmit = async (data: CreateUserDto) => {
        if (!session?.accessToken) {
            toast.error("Você precisa estar autenticado para criar um usuário.")
            return
        }

        setIsSubmitting(true)
        try {
            const newUser = await createUser(data, session.accessToken)
            toast.success(`Usuário "${data.name}" criado com sucesso!`)
            form.reset()
            setOpen(false)

            // Atualiza o cache do React Query para todas as listas de usuários
            queryClient.invalidateQueries({ queryKey: ["users"] })
            // Recarrega componentes de servidor do Next.js se houver
            router.refresh()

            onSuccess?.(newUser)
        } catch (error: any) {
            console.error("Erro ao criar usuário:", error)
            const message = error?.response?.data?.message || "Ocorreu um erro ao criar o usuário."
            toast.error(Array.isArray(message) ? message.join(", ") : message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            form.reset()
        }
        setOpen(newOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="space-y-6">
                <DialogHeader>
                    <DialogTitle>Criar usuário</DialogTitle>
                    <DialogDescription>Insira os dados do novo usuário para criá-lo.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id="create-user-dialog-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-2 gap-x-2 gap-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Marcuth" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="marcuth" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail *</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="usuario@exemplo.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cargo *</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione um cargo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Cargos de usuário</SelectLabel>
                                                    {Object.values(UserRole).map((role) => (
                                                        <SelectItem value={role} key={role}>
                                                            {role}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Senha *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="••••••••" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isSubmitting}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button type="submit" form="create-user-dialog-form" disabled={isSubmitting}>
                        {isSubmitting ? "Criando..." : "Criar usuário"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUserDialog
