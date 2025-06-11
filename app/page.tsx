"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Alert as UIAlert } from "@/components/ui/alert"
import {
  MapPin,
  MessageCircle,
  AlertTriangle,
  UserIcon,
  Wifi,
  WifiOff,
  Send,
  Phone,
  Shield,
  Users,
  Home,
} from "lucide-react"

import InteractiveMap from "./components/interactive-map"

interface AppUser {
  id: string
  name: string
  age: number
  location: string
  propertyType: string
  propertySize: string
  joinDate: string
  avatar?: string
}

interface AppAlert {
  id: string
  userId: string
  userName: string
  type: "emergência" | "segurança" | "ajuda" | "incêndio" | "mecânico"
  message: string
  location: string
  timestamp: Date
  status: "open" | "resolved"
}

interface Message {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
  type: "general" | "alert"
}

// Função para gerar dados aleatórios do usuário
const generateRandomUserData = (username: string): AppUser => {
  const locations = [
    "Fazenda Santa Clara, Interior - SP",
    "Sítio Boa Esperança, Ribeirão Preto - SP",
    "Fazenda São José, Campinas - SP",
    "Rancho Alegre, Piracicaba - SP",
    "Chácara Verde, Araraquara - SP",
    "Fazenda Progresso, Franca - SP",
    "Sítio Bela Vista, São Carlos - SP",
    "Fazenda Esperança, Bauru - SP",
    "Rancho do Sol, Marília - SP",
    "Chácara Feliz, Presidente Prudente - SP",
    "Fazenda Nova Era, Araçatuba - SP",
    "Sítio Paraíso, Botucatu - SP",
  ]

  const propertyTypes = [
    "Agricultura e Pecuária",
    "Pecuária de Corte",
    "Pecuária Leiteira",
    "Agricultura - Soja e Milho",
    "Agricultura - Café",
    "Avicultura",
    "Suinocultura",
    "Horticultura",
    "Fruticultura",
    "Agricultura Orgânica",
    "Silvicultura",
    "Agricultura - Cana-de-açúcar",
  ]

  const propertySizes = [
    "15 hectares",
    "25 hectares",
    "40 hectares",
    "60 hectares",
    "80 hectares",
    "120 hectares",
    "150 hectares",
    "200 hectares",
    "250 hectares",
    "300 hectares",
    "450 hectares",
    "600 hectares",
  ]

  const ages = [28, 32, 35, 38, 42, 45, 48, 52, 55, 58, 62, 65]

  const joinDates = [
    "2024-01-15",
    "2024-02-20",
    "2024-03-10",
    "2023-12-05",
    "2023-11-18",
    "2023-10-22",
    "2023-09-14",
    "2023-08-30",
    "2023-07-12",
    "2023-06-25",
    "2023-05-08",
    "2023-04-16",
  ]

  return {
    id: "1",
    name: username,
    age: ages[Math.floor(Math.random() * ages.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
    propertySize: propertySizes[Math.floor(Math.random() * propertySizes.length)],
    joinDate: joinDates[Math.floor(Math.random() * joinDates.length)],
    avatar: "/placeholder.svg?height=100&width=100",
  }
}

export default function AgroHelpApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [activeTab, setActiveTab] = useState("home")
  const [isOnline, setIsOnline] = useState(true)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [alerts, setAlerts] = useState<AppAlert[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [newAlert, setNewAlert] = useState({ type: "help", message: "" })

  // Simular dados iniciais
  useEffect(() => {
    const mockAlerts: AppAlert[] = [
      {
        id: "1",
        userId: "2",
        userName: "João Silva",
        type: "mecânico",
        message: "Pneu furado na estrada rural, preciso de ajuda",
        location: "Fazenda São José - 3km",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: "open",
      },
      {
        id: "2",
        userId: "3",
        userName: "Maria Santos",
        type: "segurança",
        message: "Movimento suspeito próximo à cerca norte",
        location: "Sítio Boa Vista - 5km",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        status: "open",
      },
      {
        id: "3",
        userId: "4",
        userName: "Carlos Oliveira",
        type: "incêndio",
        message: "Foco de incêndio na pastagem",
        location: "Fazenda Santa Clara - 7km",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        status: "resolved",
      },
    ]

    const mockMessages: Message[] = [
      {
        id: "1",
        userId: "2",
        userName: "João Silva",
        message: "Bom dia pessoal! Alguém tem arame farpado sobrando?",
        timestamp: new Date(Date.now() - 120 * 60 * 1000),
        type: "general",
      },
      {
        id: "2",
        userId: "3",
        userName: "Maria Santos",
        message: "Atenção! Avistei pessoas suspeitas na região",
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        type: "alert",
      },
    ]

    setAlerts(mockAlerts)
    setMessages(mockMessages)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.username && loginForm.password) {
      const user = generateRandomUserData(loginForm.username)
      setCurrentUser(user)
      setIsLoggedIn(true)
    }
  }

  const sendMessage = () => {
    if (newMessage.trim() && currentUser) {
      const message: Message = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        message: newMessage,
        timestamp: new Date(),
        type: "general",
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const sendAlert = () => {
    if (newAlert.message.trim() && currentUser) {
      const alert: AppAlert = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        type: newAlert.type as AppAlert["type"],
        message: newAlert.message,
        location: currentUser.location,
        timestamp: new Date(),
        status: "open",
      }
      setAlerts([alert, ...alerts])
      setNewAlert({ type: "help", message: "" })

      // Também adicionar como mensagem no chat
      const alertMessage: Message = {
        id: (Date.now() + 1).toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        message: `🚨 ALERTA: ${newAlert.message}`,
        timestamp: new Date(),
        type: "alert",
      }
      setMessages([...messages, alertMessage])
    }
  }

  const getAlertIcon = (type: AppAlert["type"]) => {
    switch (type) {
      case "emergência":
        return "🚨"
      case "segurança":
        return "🔒"
      case "incêndio":
        return "🔥"
      case "mecânico":
        return "🔧"
      default:
        return "❓"
    }
  }

  const getAlertColor = (type: AppAlert["type"]) => {
    switch (type) {
      case "emergência":
        return "destructive"
      case "segurança":
        return "destructive"
      case "incêndio":
        return "destructive"
      case "mecânico":
        return "default"
      default:
        return "secondary"
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex flex-col items-center">
              <img
                src="/logo.png"
                alt="AgroHelp Logo"
                className="w-32 h-32 mb-2 rounded-full border-4 border-green-200 shadow-lg"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">AgroHelp</CardTitle>
            <CardDescription>Segurança e Apoio no Campo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu nome"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="AgroHelp Logo" className="w-8 h-8 rounded-full border-2 border-white/20" />
            <h1 className="text-xl font-bold">AgroHelp</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLoggedIn(false)}
              className="text-white hover:bg-green-700"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="home" className="flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Alertas</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-1">
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Bem-vindo, {currentUser?.name}!</h2>
              <p className="opacity-90">Sua rede de apoio local está ativa</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <CardTitle className="ml-2 text-lg">Usuários Próximos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-sm text-muted-foreground">Em um raio de 10km</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <CardTitle className="ml-2 text-lg">Alertas Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{alerts.filter((a) => a.status === "open").length}</div>
                  <p className="text-sm text-muted-foreground">Necessitam atenção</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <CardTitle className="ml-2 text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Seguro</div>
                  <p className="text-sm text-muted-foreground">Área monitorada</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Alertas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl">{getAlertIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{alert.userName}</span>
                          <UIAlert variant={getAlertColor(alert.type) as any}>{alert.type}</UIAlert>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.location} • {alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Mapa Interativo</span>
                </CardTitle>
                <CardDescription>Sua localização e propriedades próximas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <InteractiveMap
                    currentUser={currentUser}
                    alerts={alerts}
                    onAlertClick={(alertId) => {
                      setActiveTab("alerts")
                    }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                    <span>Sua localização</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
                    <span>Propriedades próximas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
                    <span>Alertas ativos</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow"></div>
                    <span>Alertas resolvidos</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat Comunitário</span>
                </CardTitle>
                <CardDescription>Converse com produtores próximos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex space-x-3 ${message.type === "alert" ? "bg-red-50 p-2 rounded" : ""}`}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{message.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{message.userName}</span>
                            <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm mt-1">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Enviar Alerta</span>
                </CardTitle>
                <CardDescription>Comunique situações de emergência ou pedidos de ajuda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-type">Tipo de Alerta</Label>
                    <select
                      id="alert-type"
                      className="w-full p-2 border rounded-md"
                      value={newAlert.type}
                      onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                    >
                      <option value="ajuda">Pedido de Ajuda</option>
                      <option value="mecânico">Problema Mecânico</option>
                      <option value="segurança">Segurança</option>
                      <option value="incêndio">Incêndio</option>
                      <option value="emergência">Emergência Médica</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-message">Descrição</Label>
                    <Textarea
                      id="alert-message"
                      placeholder="Descreva a situação..."
                      value={newAlert.message}
                      onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                    />
                  </div>
                  <Button onClick={sendAlert} className="w-full bg-red-600 hover:bg-red-700">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Enviar Alerta
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chamados Abertos</CardTitle>
                <CardDescription>Alertas ativos na sua região</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{getAlertIcon(alert.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">{alert.userName}</span>
                              <UIAlert variant={getAlertColor(alert.type) as any}>{alert.type}</UIAlert>
                              <UIAlert variant={alert.status === "open" ? "destructive" : "secondary"}>
                                {alert.status === "open" ? "Aberto" : "Resolvido"}
                              </UIAlert>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{alert.location}</span>
                              </span>
                              <span>{alert.timestamp.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        {alert.status === "open" && (
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-1" />
                            Ajudar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5" />
                  <span>Meu Perfil</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentUser && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                        <p className="text-gray-600">{currentUser.age} anos</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Localização</Label>
                        <p className="text-sm">{currentUser.location}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Tipo de Produção</Label>
                        <p className="text-sm">{currentUser.propertyType}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Tamanho da Propriedade</Label>
                        <p className="text-sm">{currentUser.propertySize}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Membro desde</Label>
                        <p className="text-sm">{new Date(currentUser.joinDate).toLocaleDateString("pt-BR")}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">Estatísticas</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">5</div>
                          <div className="text-sm text-gray-600">Alertas Enviados</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">12</div>
                          <div className="text-sm text-gray-600">Ajudas Prestadas</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">8</div>
                          <div className="text-sm text-gray-600">Conexões</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Emergency Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="bg-red-600 hover:bg-red-700 rounded-full w-16 h-16 shadow-lg"
          onClick={() => setActiveTab("alerts")}
        >
          <AlertTriangle className="w-8 h-8" />
        </Button>
      </div>
    </div>
  )
}
