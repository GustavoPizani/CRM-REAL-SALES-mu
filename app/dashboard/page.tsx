"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Building,
  Activity,
} from "lucide-react"
import type { Client, Task } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

// Mock data
const mockStats = {
  totalClients: 156,
  activeClients: 89, // Clientes em andamento no pipeline
  totalRevenue: 2450000,
  monthlyRevenue: 850000,
  conversionRate: 23.5,
}

const mockRecentClients: Client[] = [
  {
    id: "1",
    full_name: "João Silva",
    phone: "(11) 99999-9999",
    email: "joao@email.com",
    funnel_status: "Visitado",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
    user_id: "1",
    property_title: "Apartamento 3 quartos Vila Madalena",
    assigned_user: {
      id: "1",
      name: "Ana Oliveira",
      email: "ana@email.com",
      role: "corretor",
      created_at: "2024-01-01T00:00:00Z",
    },
  },
  {
    id: "2",
    full_name: "Maria Santos",
    phone: "(11) 88888-8888",
    email: "maria@email.com",
    funnel_status: "Proposta",
    created_at: "2024-01-19T00:00:00Z",
    updated_at: "2024-01-19T00:00:00Z",
    user_id: "2",
    property_title: "Casa 4 quartos Jardins",
    assigned_user: {
      id: "2",
      name: "Carlos Ferreira",
      email: "carlos@email.com",
      role: "corretor",
      created_at: "2024-01-01T00:00:00Z",
    },
  },
]

const mockUpcomingTasks: Task[] = [
  {
    id: "1",
    title: "Ligar para João Silva",
    description: "Agendar segunda visita",
    due_date: "2024-01-22",
    due_time: "09:00",
    status: "pending",
    priority: "high",
    type: "call",
    client_id: "1",
    client_name: "João Silva",
    user_id: "1",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "2",
    title: "Visita com Maria Santos",
    description: "Mostrar casa nos Jardins",
    due_date: "2024-01-22",
    due_time: "14:00",
    status: "pending",
    priority: "medium",
    type: "visit",
    client_id: "2",
    client_name: "Maria Santos",
    user_id: "2",
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(mockStats)
  const [recentClients, setRecentClients] = useState<Client[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento dos dados
    setTimeout(() => {
      setRecentClients(mockRecentClients)
      setUpcomingTasks(mockUpcomingTasks)
      setLoading(false)
    }, 1000)

    // TODO: Implementar chamada real para API
    // fetch('/api/dashboard/stats')
    //   .then(res => res.json())
    //   .then(data => setStats(data));

    // fetch('/api/clients/count?status=em_andamento')
    //   .then(res => res.json())
    //   .then(data => setStats(prev => ({ ...prev, activeClients: data.count })));
  }, [])

  const getStatusColor = (status: string) => {
    const colors = {
      Contato: "bg-gray-100 text-gray-800",
      Diagnóstico: "bg-blue-100 text-blue-800",
      Agendado: "bg-yellow-100 text-yellow-800",
      Visitado: "bg-orange-100 text-orange-800",
      Proposta: "bg-purple-100 text-purple-800",
      Contrato: "bg-green-100 text-green-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "text-red-600",
      medium: "text-yellow-600",
      low: "text-green-600",
    }
    return colors[priority as keyof typeof colors] || "text-gray-600"
  }

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />
      case "visit":
        return <Building className="h-4 w-4" />
      case "follow_up":
        return <Mail className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Olá, {user?.name || "Usuário"}! 👋</h1>
        <p className="text-gray-600">Aqui está um resumo das suas atividades e performance</p>
      </div>

      {/* Métricas Principais - Card de Meta removido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-blue-600">{stats.activeClients}</p>
                <p className="text-xs text-gray-500">Clientes em andamento no pipeline</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Mensal</p>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.monthlyRevenue)}</p>
                <p className="text-xs text-gray-500">Taxa de conversão: {stats.conversionRate}%</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clientes Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clientes Recentes
            </CardTitle>
            <CardDescription>Últimos clientes adicionados ao sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhum cliente recente encontrado.</p>
              ) : (
                recentClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {client.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.full_name}</p>
                        <p className="text-sm text-gray-600">{client.property_title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(client.funnel_status)} variant="secondary">
                            {client.funnel_status}
                          </Badge>
                          {client.assigned_user && (
                            <span className="text-xs text-gray-500">{client.assigned_user.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => (window.location.href = `/client/${client.id}`)}>
                      Ver Detalhes
                    </Button>
                  </div>
                ))
              )}
            </div>
            {recentClients.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => (window.location.href = "/pipeline")}
                >
                  Ver Todos os Clientes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximas Tarefas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Tarefas
            </CardTitle>
            <CardDescription>Tarefas agendadas para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Nenhuma tarefa agendada.</p>
              ) : (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                      {getTaskTypeIcon(task.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{task.client_name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(task.due_date).toLocaleDateString("pt-BR")} às {task.due_time}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            {upcomingTasks.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => (window.location.href = "/tasks")}
                >
                  Ver Todas as Tarefas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcionalidades mais utilizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => (window.location.href = "/pipeline")}
            >
              <Users className="h-6 w-6" />
              <span>Novo Cliente</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => (window.location.href = "/properties")}
            >
              <Building className="h-6 w-6" />
              <span>Novo Imóvel</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => (window.location.href = "/tasks")}
            >
              <Calendar className="h-6 w-6" />
              <span>Nova Tarefa</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => (window.location.href = "/pipeline")}
            >
              <TrendingUp className="h-6 w-6" />
              <span>Ver Pipeline</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
