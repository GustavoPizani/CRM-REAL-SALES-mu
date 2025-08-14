"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  X,
  Building,
  Home,
  DollarSign,
  Square,
  Bed,
  Bath,
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  ImageIcon,
} from "lucide-react"
import type { PropertyTypology } from "@/lib/types"

interface ChangeLog {
  id: string
  field: string
  oldValue: any
  newValue: any
  timestamp: string
  user: string
}

export default function NewPropertyPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [changeLog, setChangeLog] = useState<ChangeLog[]>([])

  // Estados do formulário
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("Disponível")
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [typologies, setTypologies] = useState<PropertyTypology[]>([])
  const [developerName, setDeveloperName] = useState("")
  const [partnershipManager, setPartnershipManager] = useState("")
  const [developerPhone, setDeveloperPhone] = useState("")
  const [developerEmail, setDeveloperEmail] = useState("")

  // Auto-save com debounce
  const autoSave = useCallback(async () => {
    if (!title.trim()) return // Não salva se não tem título

    setAutoSaving(true)

    try {
      // Simular auto-save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const savedData = {
        title,
        description,
        address,
        type,
        status,
        features,
        images,
        typologies,
        developer: {
          name: developerName,
          partnership_manager: partnershipManager,
          phone: developerPhone,
          email: developerEmail,
        },
      }

      // Salvar no localStorage como backup
      localStorage.setItem("property-draft", JSON.stringify(savedData))
      setLastSaved(new Date())

      console.log("Auto-save realizado:", savedData)
    } catch (error) {
      console.error("Erro no auto-save:", error)
    } finally {
      setAutoSaving(false)
    }
  }, [
    title,
    description,
    address,
    type,
    status,
    features,
    images,
    typologies,
    developerName,
    partnershipManager,
    developerPhone,
    developerEmail,
  ])

  // Debounce para auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave()
    }, 2000) // Auto-save após 2 segundos de inatividade

    return () => clearTimeout(timer)
  }, [autoSave])

  // Carregar rascunho salvo
  useEffect(() => {
    const savedDraft = localStorage.getItem("property-draft")
    if (savedDraft) {
      try {
        const data = JSON.parse(savedDraft)
        setTitle(data.title || "")
        setDescription(data.description || "")
        setAddress(data.address || "")
        setType(data.type || "")
        setStatus(data.status || "Disponível")
        setFeatures(data.features || [])
        setImages(data.images || [])
        setTypologies(data.typologies || [])
        setDeveloperName(data.developer?.name || "")
        setPartnershipManager(data.developer?.partnership_manager || "")
        setDeveloperPhone(data.developer?.phone || "")
        setDeveloperEmail(data.developer?.email || "")
      } catch (error) {
        console.error("Erro ao carregar rascunho:", error)
      }
    }
  }, [])

  // Função para registrar mudanças
  const logChange = (field: string, oldValue: any, newValue: any) => {
    const change: ChangeLog = {
      id: Date.now().toString(),
      field,
      oldValue,
      newValue,
      timestamp: new Date().toISOString(),
      user: "Usuário Atual", // Aqui viria do contexto de autenticação
    }
    setChangeLog((prev) => [change, ...prev].slice(0, 50)) // Manter apenas os últimos 50 logs
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const propertyData = {
        title,
        description,
        address,
        type,
        status,
        features,
        images,
        typologies,
        developer: {
          name: developerName,
          partnership_manager: partnershipManager,
          phone: developerPhone,
          email: developerEmail,
        },
      }

      console.log("Salvando novo imóvel:", propertyData)

      // Limpar rascunho após salvar
      localStorage.removeItem("property-draft")

      // Simular ID do novo imóvel
      const newPropertyId = Date.now().toString()

      router.push(`/properties/${newPropertyId}`)
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setUploadingImages(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Simular upload de imagem
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Criar URL temporária para preview
        const imageUrl = URL.createObjectURL(file)
        return imageUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages((prev) => [...prev, ...uploadedUrls])

      logChange("images", images, [...images, ...uploadedUrls])
    } catch (error) {
      console.error("Erro no upload:", error)
    } finally {
      setUploadingImages(false)
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      const newFeatures = [...features, newFeature.trim()]
      logChange("features", features, newFeatures)
      setFeatures(newFeatures)
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    const newFeatures = features.filter((f) => f !== feature)
    logChange("features", features, newFeatures)
    setFeatures(newFeatures)
  }

  const addTypology = () => {
    const newTypology: PropertyTypology = {
      id: Date.now().toString(),
      name: "",
      price: 0,
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      parking_spaces: 0,
    }
    const newTypologies = [...typologies, newTypology]
    logChange("typologies", typologies, newTypologies)
    setTypologies(newTypologies)
  }

  const updateTypology = (id: string, field: keyof PropertyTypology, value: any) => {
    const oldTypologies = [...typologies]
    const newTypologies = typologies.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    logChange(`typology.${field}`, oldTypologies, newTypologies)
    setTypologies(newTypologies)
  }

  const removeTypology = (id: string) => {
    const newTypologies = typologies.filter((t) => t.id !== id)
    logChange("typologies", typologies, newTypologies)
    setTypologies(newTypologies)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    logChange("images", images, newImages)
    setImages(newImages)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/properties")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Empreendimento</h1>
            <p className="text-gray-600">Cadastre um novo empreendimento imobiliário</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status do Auto-save */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {autoSaving ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                Salvo às {formatDateTime(lastSaved)}
              </>
            ) : null}
          </div>

          <Button onClick={handleSave} disabled={saving || !title.trim()}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Empreendimento"}
          </Button>
        </div>
      </div>

      {/* Alert de permissões */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Novos empreendimentos podem ser criados por qualquer usuário. Alterações futuras precisarão de aprovação de um
          administrador ou gerente.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Nome do Empreendimento *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => {
                      logChange("title", title, e.target.value)
                      setTitle(e.target.value)
                    }}
                    placeholder="Ex: Residencial Vila Harmonia"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={type}
                    onValueChange={(value) => {
                      logChange("type", type, value)
                      setType(value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Empreendimento">Empreendimento</SelectItem>
                      <SelectItem value="Apartamento">Apartamento</SelectItem>
                      <SelectItem value="Casa">Casa</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value) => {
                      logChange("status", status, value)
                      setStatus(value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disponível">Disponível</SelectItem>
                      <SelectItem value="Reservado">Reservado</SelectItem>
                      <SelectItem value="Vendido">Vendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => {
                    logChange("address", address, e.target.value)
                    setAddress(e.target.value)
                  }}
                  placeholder="Endereço completo do empreendimento"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    logChange("description", description, e.target.value)
                    setDescription(e.target.value)
                  }}
                  placeholder="Descrição detalhada do empreendimento"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tipologias */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tipologias</CardTitle>
                <Button onClick={addTypology} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Tipologia
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {typologies.map((typology, index) => (
                  <Card key={typology.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Tipologia {index + 1}</h4>
                      <Button variant="outline" size="sm" onClick={() => removeTypology(typology.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome da Tipologia</Label>
                        <Input
                          value={typology.name}
                          onChange={(e) => updateTypology(typology.id, "name", e.target.value)}
                          placeholder="Ex: Apartamento 2 quartos"
                        />
                      </div>
                      <div>
                        <Label>Preço</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={typology.price}
                            onChange={(e) => updateTypology(typology.id, "price", Number(e.target.value))}
                            placeholder="650000"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <Label>Área (m²)</Label>
                        <div className="relative">
                          <Square className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={typology.area}
                            onChange={(e) => updateTypology(typology.id, "area", Number(e.target.value))}
                            placeholder="65"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Quartos</Label>
                        <div className="relative">
                          <Bed className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={typology.bedrooms}
                            onChange={(e) => updateTypology(typology.id, "bedrooms", Number(e.target.value))}
                            placeholder="2"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Banheiros</Label>
                        <div className="relative">
                          <Bath className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={typology.bathrooms}
                            onChange={(e) => updateTypology(typology.id, "bathrooms", Number(e.target.value))}
                            placeholder="2"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Vagas</Label>
                        <div className="relative">
                          <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            type="number"
                            value={typology.parking_spaces}
                            onChange={(e) => updateTypology(typology.id, "parking_spaces", Number(e.target.value))}
                            placeholder="1"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    {typology.price > 0 && (
                      <div className="mt-2 text-sm text-gray-600">
                        Preço: {formatCurrency(typology.price)}
                        {typology.area && typology.area > 0 && (
                          <span> • {formatCurrency(typology.price / typology.area)}/m²</span>
                        )}
                      </div>
                    )}
                  </Card>
                ))}

                {typologies.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhuma tipologia cadastrada</p>
                    <p className="text-sm">Clique em "Adicionar Tipologia" para começar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Características */}
          <Card>
            <CardHeader>
              <CardTitle>Características do Empreendimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Digite uma característica"
                  onKeyPress={(e) => e.key === "Enter" && addFeature()}
                />
                <Button onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <button onClick={() => removeFeature(feature)} className="ml-1 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {features.length === 0 && <p className="text-gray-500 text-sm">Nenhuma característica adicionada</p>}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Construtora */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Construtora
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="developerName">Nome da Construtora</Label>
                <Input
                  id="developerName"
                  value={developerName}
                  onChange={(e) => {
                    logChange("developer.name", developerName, e.target.value)
                    setDeveloperName(e.target.value)
                  }}
                  placeholder="Ex: Construtora Harmonia Ltda"
                />
              </div>

              <div>
                <Label htmlFor="partnershipManager">Gerente de Parcerias</Label>
                <Input
                  id="partnershipManager"
                  value={partnershipManager}
                  onChange={(e) => {
                    logChange("developer.partnership_manager", partnershipManager, e.target.value)
                    setPartnershipManager(e.target.value)
                  }}
                  placeholder="Nome do gerente responsável"
                />
              </div>

              <div>
                <Label htmlFor="developerPhone">Telefone</Label>
                <Input
                  id="developerPhone"
                  value={developerPhone}
                  onChange={(e) => {
                    logChange("developer.phone", developerPhone, e.target.value)
                    setDeveloperPhone(e.target.value)
                  }}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="developerEmail">E-mail</Label>
                <Input
                  id="developerEmail"
                  type="email"
                  value={developerEmail}
                  onChange={(e) => {
                    logChange("developer.email", developerEmail, e.target.value)
                    setDeveloperEmail(e.target.value)
                  }}
                  placeholder="contato@construtora.com.br"
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload de Imagens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Imagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingImages}
                  />
                  <Button variant="outline" className="w-full bg-transparent" disabled={uploadingImages}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingImages ? "Enviando..." : "Adicionar Imagens"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Imagem ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {images.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">Nenhuma imagem adicionada</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total de Tipologias</p>
                <p className="text-2xl font-bold text-primary">{typologies.length}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">Faixa de Preços</p>
                {typologies.length > 0 && typologies.some((t) => t.price > 0) ? (
                  <div className="mt-1">
                    <p className="text-sm text-gray-700">
                      De {formatCurrency(Math.min(...typologies.filter((t) => t.price > 0).map((t) => t.price)))}
                    </p>
                    <p className="text-sm text-gray-700">
                      Até {formatCurrency(Math.max(...typologies.filter((t) => t.price > 0).map((t) => t.price)))}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Nenhum preço definido</p>
                )}
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">Características</p>
                <p className="text-2xl font-bold text-green-600">{features.length}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600">Imagens</p>
                <p className="text-2xl font-bold text-blue-600">{images.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Alterações */}
          {changeLog.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Histórico de Alterações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {changeLog.slice(0, 10).map((change) => (
                    <div key={change.id} className="text-xs p-2 bg-gray-50 rounded">
                      <p className="font-medium">{change.field}</p>
                      <p className="text-gray-600">
                        {new Date(change.timestamp).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
