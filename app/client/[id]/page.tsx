"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  MapPin,
  DollarSign,
  User,
  MessageCircle,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  ArrowUpDown,
} from "lucide-react"
import { type Client, type ClientNote, FUNNEL_STAGES, type Task, DEFAULT_LOST_REASONS } from "@/lib/types"

// Mock data expandido
const mockClient: Client = {
  id: "1",
  full_name: "João Silva",
  phone: "(11) 99999-9999",
  email: "joao@email.com",
  funnel_status: "Visitado",
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2024-01-18T00:00:00Z",
  user_id: "1",
  property_of_interest_id: "1",
  property_title: "Apartamento 3 quartos Vila Madalena",
  property_address: "Rua Harmonia, 123 - Vila Madalena, São Paulo - SP",
  property_price: 850000,
  assigned_user: {
    id: "1",
    name: "Ana Oliveira",
    email: "ana@email.com",
    role: "corretor",
    created_at: "2024-01-01T00:00:00Z",
  },
}

const mockNotes: ClientNote[] = [
  {
    id: "1",
    client_id: "1",
    user_id: "1",
    note: "Cliente demonstrou muito interesse no imóvel. Agendamos uma segunda visita para o próximo sábado.",
    created_at: "2024-01-18T14:30:00Z",
    user_name: "Ana Oliveira",
  },
  {
    id: "2",
    client_id: "1",
    user_id: "1",
    note: "Primeira visita realizada. Cliente gostou da localização e do acabamento.",
    created_at: "2024-01-16T10:15:00Z",
    user_name: "Ana Oliveira",
  },
]

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Ligar para agendar segunda visita",
    description: "Cliente pediu para agendar nova visita no final de semana",
    due_date: "2024-01-22",
    due_time: "09:00",
    status: "pending",
    priority: "high",
    type: "call",
    client_id: "1",
    user_id: "1",
    created_at: "2024-01-18T15:00:00Z",
    updated_at: "2024-01-18T15:00:00Z",
  },
]

export default function ClientDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [notes, setNotes] = useState<ClientNote[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddNote, setShowAddNote] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showWonDialog, setShowWonDialog] = useState(false)
  const [showLostDialog, setShowLostDialog] = useState(false)
  const [showFunnelDialog, setShowFunnelDialog] = useState(false)

  const [newNote, setNewNote] = useState("")
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    due_date: "",
    due_time: "",
    type: "call",
  })

  const [lostReason, setLostReason] = useState("")
  const [wonDetails, setWonDetails] = useState({
    sale_value: "",
    sale_date: "",
  })
  const [newFunnelStatus, setNewFunnelStatus] = useState("")

  useEffect(() => {
    // Simular carregamento dos dados
    setTimeout(() => {
      setClient(mockClient)
      setNotes(mockNotes)
      setTasks(mockTasks)
      setNewFunnelStatus(mockClient.funnel_status)
      setLoading(false)
    }, 1000)
  }, [params.id])

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()

    const note: ClientNote = {
      id: Date.now().toString(),
      client_id: client?.id || "",
      user_id: "1",
      note: newNote,
      created_at: new Date().toISOString(),
      user_name: "Ana Oliveira",
    }

    setNotes((prev) => [note, ...prev])
    setNewNote("")
    setShowAddNote(false)
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()

    const task: Task = {
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      due_date: taskForm.due_date,
      due_time: taskForm.due_time,
      status: "pending",
      priority: "medium",
      type: taskForm.type as any,
      client_id: client?.id,
      user_id: "1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setTasks((prev) => [task, ...prev])
    setTaskForm({
      title: "",
      description: "",
      due_date: "",
      due_time: "",
      type: "call",
    })
    setShowAddTask(false)
  }

  const handleMarkAsWon = async () => {
    if (client) {
      const updatedClient = {
        ...client,
        funnel_status: "Ganho" as any,
        status: "won" as any,
        updated_at: new Date().toISOString(),
      }

      setClient(updatedClient)
      setShowWonDialog(false)
    }
  }

  const handleMarkAsLost = async () => {
    if (client) {
      const updatedClient = {
        ...client,
        funnel_status: "Perdido" as any,
        status: "lost" as any,
        lost_reason: lostReason,
        updated_at: new Date().toISOString(),
      }

      setClient(updatedClient)
      setShowLostDialog(false)
    }
  }

  const handleChangeFunnelStatus = async () => {
    if (client && newFunnelStatus) {
      // Simular chamada à API
      const updatedClient = {
        ...client,
        funnel_status: newFunnelStatus as any,
        updated_at: new Date().toISOString(),
      }

      setClient(updatedClient)
      setShowFunnelDialog(false)

      // Aqui seria feita a chamada real à API
      // await fetch(`/api/clients/${client.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ funnel_status: newFunnelStatus })
      // })
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      Contato: "bg-gray-100 text-gray-800",
      Diagnóstico: "bg-blue-100 text-blue-800",
      Agendado: "bg-yellow-100 text-yellow-800",
      Visitado: "bg-orange-100 text-orange-800",
      Proposta: "bg-purple-100 text-purple-800",
      Contrato: "bg-green-100 text-green-800",
      Ganho: "bg-emerald-100 text-emerald-800",
      Perdido: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />
      case "visit":
        return <Building className="h-4 w-4" />
      case "follow_up":
        return <MessageCircle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cliente não encontrado</h2>
          <p className="text-gray-600 mb-4">O cliente que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => router.push("/pipeline")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Pipeline
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/pipeline")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.full_name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(client.funnel_status)}>{client.funnel_status}</Badge>
              {client.assigned_user && (
                <span className="text-sm text-gray-600">Corretor: {client.assigned_user.name}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {client.funnel_status !== "Ganho" && client.funnel_status !== "Perdido" && (
            <>
              <Dialog open={showWonDialog} onOpenChange={setShowWonDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-green-600 hover:text-green-700 bg-transparent">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Cliente Ganho
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Marcar Cliente como Ganho</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sale_value">Valor da Venda (R$)</Label>
                      <Input
                        id="sale_value"
                        type="number"
                        step="0.01"
                        value={wonDetails.sale_value}
                        onChange={(e) => setWonDetails((prev) => ({ ...prev, sale_value: e.target.value }))}
                        placeholder="850000.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sale_date">Data da Venda</Label>
                      <Input
                        id="sale_date"
                        type="date"
                        value={wonDetails.sale_date}
                        onChange={(e) => setWonDetails((prev) => ({ ...prev, sale_date: e.target.value }))}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowWonDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleMarkAsWon} className="bg-green-600 hover:bg-green-700">
                        Confirmar Venda
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showLostDialog} onOpenChange={setShowLostDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cliente Perdido
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Marcar Cliente como Perdido</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="lost_reason">Motivo da Perda</Label>
                      <Select value={lostReason} onValueChange={setLostReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {DEFAULT_LOST_REASONS.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowLostDialog(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleMarkAsLost} className="bg-red-600 hover:bg-red-700">
                        Confirmar Perda
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Cliente - Agora apenas visualização */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Nome Completo</Label>
                  <p className="font-medium text-lg">{client.full_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Telefone</Label>
                    <p className="font-medium">{client.phone || "Não informado"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">E-mail</Label>
                    <p className="font-medium">{client.email || "Não informado"}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Data de Cadastro</Label>
                    <p className="font-medium">{new Date(client.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Última Atualização</Label>
                    <p className="font-medium">{new Date(client.updated_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarefas - Movido para a coluna principal */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tarefas</CardTitle>
                <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Tarefa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Nova Tarefa</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddTask} className="space-y-4">
                      <div>
                        <Label htmlFor="task_title">Título *</Label>
                        <Input
                          id="task_title"
                          value={taskForm.title}
                          onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="task_description">Descrição</Label>
                        <Textarea
                          id="task_description"
                          value={taskForm.description}
                          onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Descreva a tarefa..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="task_date">Data *</Label>
                          <Input
                            id="task_date"
                            type="date"
                            value={taskForm.due_date}
                            onChange={(e) => setTaskForm((prev) => ({ ...prev, due_date: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="task_time">Horário *</Label>
                          <Input
                            id="task_time"
                            type="time"
                            value={taskForm.due_time}
                            onChange={(e) => setTaskForm((prev) => ({ ...prev, due_time: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="task_type">Tipo</Label>
                        <Select
                          value={taskForm.type}
                          onValueChange={(value) => setTaskForm((prev) => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">Ligação</SelectItem>
                            <SelectItem value="visit">Visita</SelectItem>
                            <SelectItem value="follow_up">Follow-up</SelectItem>
                            <SelectItem value="meeting">Reunião</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddTask(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">Criar Tarefa</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarefa</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          Nenhuma tarefa criada ainda.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{task.title}</p>
                              {task.description && (
                                <p className="text-sm text-gray-600 truncate max-w-xs">{task.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTaskTypeIcon(task.type)}
                              <span className="capitalize">{task.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(task.due_date).toLocaleDateString("pt-BR")} às {task.due_time}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                              <div className="flex items-center gap-1">
                                {task.status === "completed" ? (
                                  <CheckCircle className="h-3 w-3" />
                                ) : (
                                  <Clock className="h-3 w-3" />
                                )}
                                {task.status === "completed" ? "Concluída" : "Pendente"}
                              </div>
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Anotações */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Anotações</CardTitle>
                <Dialog open={showAddNote} onOpenChange={setShowAddNote}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Anotação
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Anotação</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddNote} className="space-y-4">
                      <div>
                        <Label htmlFor="note">Anotação</Label>
                        <Textarea
                          id="note"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Digite sua anotação..."
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddNote(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">Adicionar</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhuma anotação ainda. Adicione a primeira!</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="border-l-4 border-primary pl-4 py-2">
                      <p className="text-gray-900">{note.note}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{note.user_name}</span>
                        <span>•</span>
                        <span>{new Date(note.created_at).toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Imóvel de Interesse - Movido para a sidebar */}
          {client.property_title && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Imóvel de Interesse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h3 className="font-medium text-lg">{client.property_title}</h3>

                  {client.property_address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{client.property_address}</span>
                    </div>
                  )}

                  {client.property_price && (
                    <div className="flex items-center gap-2 text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-lg">R$ {client.property_price.toLocaleString("pt-BR")}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push(`/properties/${client.property_of_interest_id}`)}
                    >
                      Ver Detalhes do Imóvel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.phone && (
                <Button className="w-full bg-transparent" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar para {client.phone}
                </Button>
              )}

              {client.email && (
                <Button className="w-full bg-transparent" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar E-mail
                </Button>
              )}

              {client.phone && (
                <Button className="w-full bg-transparent" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Enviar WhatsApp
                </Button>
              )}

              <Button className="w-full bg-transparent" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Visita
              </Button>

              {/* Nova Ação: Alterar Etapa do Funil */}
              <Dialog open={showFunnelDialog} onOpenChange={setShowFunnelDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-transparent" variant="outline">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Alterar Etapa do Funil
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Alterar Etapa do Funil</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Etapa Atual</Label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(client.funnel_status)}>{client.funnel_status}</Badge>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new_funnel_status">Selecione a nova etapa</Label>
                      <Select value={newFunnelStatus} onValueChange={setNewFunnelStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a nova etapa" />
                        </SelectTrigger>
                        <SelectContent>
                          {FUNNEL_STAGES.map((stage) => (
                            <SelectItem key={stage} value={stage} disabled={stage === client.funnel_status}>
                              {stage}
                              {stage === client.funnel_status && " (Atual)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowFunnelDialog(false)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleChangeFunnelStatus}
                        disabled={!newFunnelStatus || newFunnelStatus === client.funnel_status}
                      >
                        Salvar Alteração
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Resumo do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Status Atual</p>
                <Badge className={getStatusColor(client.funnel_status)}>{client.funnel_status}</Badge>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">Corretor Responsável</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{client.assigned_user?.name}</span>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">Anotações</p>
                <p className="text-2xl font-bold text-primary">{notes.length}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Tarefas Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tasks.filter((t) => t.status === "pending").length}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">Cliente desde</p>
                <p className="font-medium">{new Date(client.created_at).toLocaleDateString("pt-BR")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
