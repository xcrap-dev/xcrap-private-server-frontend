"use client"

import {
    LuCode,
    LuEye,
    LuEyeOff,
    LuGlobe,
    LuKey,
    LuLock,
    LuSearch,
    LuSettings,
    LuTerminal,
    LuTrash,
} from "react-icons/lu"
import { type FC, useMemo, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrentUserApiKey } from "@/hooks/use-current-user-api-key"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FindOneClientResponse } from "@/services/api/clients"
import { Typography } from "@/components/ui/typography"
import CodeBlock from "@/components/ui/code-block"
import configHelper from "@/helpers/config"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Props = {
    data: FindOneClientResponse
    apiKey?: string
}

type AuthMethod = "api-key" | "email-password"
type ActionType = "find-one" | "update" | "delete" | "find-many"

const ClientSdkCodeGenerator: FC<Props> = ({ data, apiKey: propApiKey }) => {
    const [authMethod, setAuthMethod] = useState<AuthMethod>("api-key")
    const [action, setAction] = useState<ActionType>("find-one")
    const [maskApiKey, setMaskApiKey] = useState(false)

    const { apiKey: hookApiKey, user, isLoading: isLoadingUser } = useCurrentUserApiKey()
    const userApiKey = propApiKey || hookApiKey

    const baseUrl = configHelper.apiUrl || "http://localhost:3000/api"

    const effectiveApiKey = useMemo(() => {
        if (!userApiKey) return "SUA_API_KEY_AQUI"
        if (maskApiKey) {
            return userApiKey.length > 8 ? `${userApiKey.slice(0, 6)}••••••••••••••••` : "••••••••••••••••"
        }
        return userApiKey
    }, [userApiKey, maskApiKey])

    const userEmail = user?.email || "seu-email@exemplo.com"

    const generatedCode = useMemo(() => {
        const clientId = data.id
        const clientName = data.name

        if (authMethod === "api-key") {
            switch (action) {
                case "find-one":
                    return `import { Xcrap } from "@xcrap/api"

// 1. Inicializa o cliente Xcrap com a sua API Key e a URL do servidor
const xcrap = new Xcrap({
  apiKey: "${effectiveApiKey}",
  baseUrl: "${baseUrl}",
})

async function main() {
  console.log("Buscando informações do cliente '${clientName}'...")

  // 2. Busca os dados detalhados do cliente pelo seu identificador
  const client = await xcrap.clients.findOne("${clientId}")

  console.log("Cliente encontrado:")
  console.log(JSON.stringify(client, null, 2))
}

main().catch(console.error)`

                case "update":
                    return `import { Xcrap } from "@xcrap/api"

const xcrap = new Xcrap({
  apiKey: "${effectiveApiKey}",
  baseUrl: "${baseUrl}",
})

async function main() {
  // Atualiza as propriedades do cliente
  const updatedClient = await xcrap.clients.update("${clientId}", {
    name: "${clientName} (Atualizado)",
    description: "Descrição atualizada via SDK Node.js",
  })

  console.log("Cliente atualizado com sucesso:", updatedClient)
}

main().catch(console.error)`

                case "delete":
                    return `import { Xcrap } from "@xcrap/api"

const xcrap = new Xcrap({
  apiKey: "${effectiveApiKey}",
  baseUrl: "${baseUrl}",
})

async function main() {
  // Remove permanentemente o cliente do servidor
  await xcrap.clients.delete("${clientId}")
  console.log("Cliente '${clientId}' excluído com sucesso!")
}

main().catch(console.error)`

                case "find-many":
                    return `import { Xcrap } from "@xcrap/api"

const xcrap = new Xcrap({
  apiKey: "${effectiveApiKey}",
  baseUrl: "${baseUrl}",
})

async function main() {
  // Lista todos os clientes cadastrados com paginação
  const response = await xcrap.clients.findMany({
    page: 1,
    perPage: 10,
  })

  console.log(\`Total de clientes: \${response.meta.total}\`)
  console.log("Clientes:", response.data)
}

main().catch(console.error)`
            }
        } else {
            // Email and password auth
            switch (action) {
                case "find-one":
                    return `import { Xcrap, AuthService } from "@xcrap/api"

async function main() {
  // 1. Autentica com email e senha para obter os tokens
  const auth = new AuthService({
    baseUrl: "${baseUrl}",
  })

  const tokens = await auth.signIn({
    email: "${userEmail}",
    password: "sua-senha-segura",
  })

  // 2. Instancia o cliente Xcrap utilizando os tokens de autenticação
  const xcrap = new Xcrap({
    tokens,
    baseUrl: "${baseUrl}",
  })

  // 3. Busca o cliente '${clientName}'
  const client = await xcrap.clients.findOne("${clientId}")

  console.log("Cliente encontrado:", client)
}

main().catch(console.error)`

                case "update":
                    return `import { Xcrap, AuthService } from "@xcrap/api"

async function main() {
  const auth = new AuthService({ baseUrl: "${baseUrl}" })
  const tokens = await auth.signIn({
    email: "${userEmail}",
    password: "sua-senha-segura",
  })

  const xcrap = new Xcrap({ tokens, baseUrl: "${baseUrl}" })

  const updatedClient = await xcrap.clients.update("${clientId}", {
    name: "${clientName} (Atualizado)",
    description: "Descrição atualizada via SDK",
  })

  console.log("Cliente atualizado:", updatedClient)
}

main().catch(console.error)`

                case "delete":
                    return `import { Xcrap, AuthService } from "@xcrap/api"

async function main() {
  const auth = new AuthService({ baseUrl: "${baseUrl}" })
  const tokens = await auth.signIn({
    email: "${userEmail}",
    password: "sua-senha-segura",
  })

  const xcrap = new Xcrap({ tokens, baseUrl: "${baseUrl}" })

  await xcrap.clients.delete("${clientId}")
  console.log("Cliente '${clientId}' excluído!")
}

main().catch(console.error)`

                default:
                    return `import { Xcrap, AuthService } from "@xcrap/api"

async function main() {
  const auth = new AuthService({ baseUrl: "${baseUrl}" })
  const tokens = await auth.signIn({
    email: "${userEmail}",
    password: "sua-senha-segura",
  })

  const xcrap = new Xcrap({ tokens, baseUrl: "${baseUrl}" })

  const response = await xcrap.clients.findMany()
  console.log("Clientes:", response.data)
}

main().catch(console.error)`
            }
        }
    }, [authMethod, action, data, baseUrl, effectiveApiKey, userEmail])

    return (
        <Card className="border border-border/70 space-y-4">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <LuCode className="w-5 h-5 text-primary" /> Integração com SDK Node.js (@xcrap/api)
                    </CardTitle>
                    <Badge variant="outline" className="font-mono text-xs">
                        v1.0.0
                    </Badge>
                </div>
                <CardDescription>
                    Código pronto para copiar e rodar em Node.js ou TypeScript, configurado especificamente para gerenciar
                    este cliente.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Typography.Small className="font-medium text-xs text-muted-foreground flex items-center gap-1.5">
                        <LuTerminal className="w-3.5 h-3.5" /> 1. Instalação do Pacote
                    </Typography.Small>
                    <CodeBlock code="npm i @xcrap/api" language="bash" fileName="Terminal" />
                </div>

                <div className="space-y-3">
                    <Typography.Small className="font-medium text-xs text-muted-foreground flex items-center gap-1.5">
                        <LuSettings className="w-3.5 h-3.5" /> 2. Configuração do Exemplo de Código
                    </Typography.Small>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <span className="text-xs text-muted-foreground">Método de Autenticação:</span>
                            <Tabs value={authMethod} onValueChange={(val) => setAuthMethod(val as AuthMethod)}>
                                <TabsList className="w-full grid grid-cols-2">
                                    <TabsTrigger value="api-key" className="text-xs flex items-center gap-1">
                                        <LuKey className="w-3 h-3" /> API Key
                                    </TabsTrigger>
                                    <TabsTrigger value="email-password" className="text-xs flex items-center gap-1">
                                        <LuLock className="w-3 h-3" /> Email & Senha
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="space-y-1.5">
                            <span className="text-xs text-muted-foreground">Ação Desejada:</span>
                            <Tabs value={action} onValueChange={(val) => setAction(val as ActionType)}>
                                <TabsList className="w-full grid grid-cols-4">
                                    <TabsTrigger value="find-one" className="text-xs flex items-center gap-1 px-1">
                                        <LuSearch className="w-3 h-3" /> Buscar
                                    </TabsTrigger>
                                    <TabsTrigger value="update" className="text-xs flex items-center gap-1 px-1">
                                        <LuSettings className="w-3 h-3" /> Atualizar
                                    </TabsTrigger>
                                    <TabsTrigger value="delete" className="text-xs flex items-center gap-1 px-1">
                                        <LuTrash className="w-3 h-3" /> Deletar
                                    </TabsTrigger>
                                    <TabsTrigger value="find-many" className="text-xs flex items-center gap-1 px-1">
                                        <LuGlobe className="w-3 h-3" /> Listar
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {authMethod === "api-key" && (
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                            <div className="flex items-center gap-2.5">
                                <LuKey className="w-4 h-4 text-primary shrink-0" />
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Typography.Small className="font-medium text-xs">
                                            Chave de API
                                        </Typography.Small>
                                        {userApiKey ? (
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0"
                                            >
                                                Chave da sua conta aplicada
                                            </Badge>
                                        ) : isLoadingUser ? (
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] text-muted-foreground animate-pulse px-1.5 py-0"
                                            >
                                                Carregando chave...
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-500/30 px-1.5 py-0"
                                            >
                                                Chave não carregada
                                            </Badge>
                                        )}
                                    </div>
                                    <Typography.Muted className="text-xs">
                                        {userApiKey
                                            ? "Sua chave de API foi resgatada do seu perfil e inserida diretamente no código."
                                            : "Acesse sua conta para obter sua chave ou substitua 'SUA_API_KEY_AQUI'."}
                                    </Typography.Muted>
                                </div>
                            </div>
                            {userApiKey && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    onClick={() => setMaskApiKey((prev) => !prev)}
                                    className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
                                    title={maskApiKey ? "Mostrar chave completa" : "Ocultar chave"}
                                >
                                    {maskApiKey ? <LuEye className="w-3.5 h-3.5" /> : <LuEyeOff className="w-3.5 h-3.5" />}
                                    {maskApiKey ? "Revelar" : "Ocultar"}
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Typography.Small className="font-medium text-xs text-muted-foreground flex items-center gap-1.5">
                        <LuCode className="w-3.5 h-3.5" /> 3. Código Gerado (TypeScript / Node.js)
                    </Typography.Small>
                    <CodeBlock
                        code={generatedCode}
                        language="typescript"
                        fileName={`manage-client-${data.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.ts`}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export default ClientSdkCodeGenerator
