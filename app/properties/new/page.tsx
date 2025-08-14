"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, X, Upload, Clock, Save, AlertCircle } from "lucide-react"

interface Typology {
  id: string
  name: string
  value: string
}

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

  // Form states
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [status, setStatus] = useState("planejamento")
  const [totalUnits, setTotalUnits] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [developerName, setDeveloperName] = useState("")
  const [partnershipManager, setPartnershipManager] = useState("")

  // Typologies
  const [typologies, setTypologies] = useState<Typology[]>([])
  const [newTypologyName, setNewTypologyName] = useState("")
  const [newTypologyValue, setNewTypologyValue] = useState("")

  // Images
  const [images, setImages] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  // Auto-save and change tracking
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [changeLog, setChangeLog] = useState<ChangeLog[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!title.trim()) return

    setAutoSaving(true)

    const draftData = {
      title,
      description,
      address,
      city,
      state,
      zipCode,
      propertyType,
      status,
      totalUnits,
      deliveryDate,
      developerName,
      partnershipManager,
      typologies,
      images,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage as backup
    localStorage.setItem("property-draft", JSON.stringify(draftData))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setAutoSaving(false)
    setLastSaved(new Date())
  }, [
    title,
    description,
    address,
    city,
    state,
    zipCode,
    propertyType,
    status,
    totalUnits,
    deliveryDate,
    developerName,
    partnershipManager,
    typologies,
    images,
  ])

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave()
    }, 2000)

    return () => clearTimeout(timer)
  }, [autoSave])

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("property-draft")
    if (draft) {
      try {
        const draftData = JSON.parse(draft)
        setTitle(draftData.title || "")
        setDescription(draftData.description || "")
        setAddress(draftData.address || "")
        setCity(draftData.city || "")
        setState(draftData.state || "")
        setZipCode(draftData.zipCode || "")
        setPropertyType(draftData.propertyType || "")
        setStatus(draftData.status || "planejamento")
        setTotalUnits(draftData.totalUnits || "")
        setDeliveryDate(draftData.deliveryDate || "")
        setDeveloperName(draftData.developerName || "")
        setPartnershipManager(draftData.partnershipManager || "")
        setTypologies(draftData.typologies || [])
        setImages(draftData.images || [])
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
  }, [])

  // Change logging
  const logChange = (field: string, oldValue: any, newValue: any) => {
    if (oldValue === newValue) return

    const change: ChangeLog = {
      id: Date.now().toString(),
      field,
      oldValue,
      newValue,
      timestamp: new Date().toISOString(),
      user: "Usuário Atual",
    }

    setChangeLog((prev) => [change, ...prev].slice(0, 50)) // Keep last 50 changes
  }

  // Image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setUploadingImages(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Simulate upload delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return URL.createObjectURL(file)
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const oldImages = [...images]
      const newImages = [...images, ...uploadedUrls]
      setImages(newImages)
      logChange("images", oldImages, newImages)
    } catch (error) {
      console.error("Error uploading images:", error)
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (index: number) => {
    const oldImages = [...images]
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    logChange("images", oldImages, newImages)
  }

  // Typology management
  const addTypology = () => {
    if (!newTypologyName.trim() || !newTypologyValue.trim()) return

    const newTypology: Typology = {
      id: Date.now().toString(),
      name: newTypologyName.trim(),
      value: newTypologyValue.trim(),
    }

    const oldTypologies = [...typologies]
    const newTypologies = [...typologies, newTypology]
    setTypologies(newTypologies)
    logChange("typologies", oldTypologies, newTypologies)

    setNewTypologyName("")
    setNewTypologyValue("")
  }

  const removeTypology = (id: string) => {
    const oldTypologies = [...typologies]
    const newTypologies = typologies.filter((t) => t.id !== id)
    setTypologies(newTypologies)
    logChange("typologies", oldTypologies, newTypologies)
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const propertyData = {
        title,
        description,
        address,
        city,
        state,
        zipCode,
        propertyType,
        status,
        totalUnits: Number.parseInt(totalUnits) || 0,
        deliveryDate,
        developerName,
        partnershipManager,
        typologies,
        images,
      }

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      })

      if (response.ok) {
        // Clear draft
        localStorage.removeItem("property-draft")
        router.push("/properties")
      } else {
        throw new Error("Failed to create property")
      }
    } catch (error) {
      console.error("Error creating property:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Novo Empreendimento</h1>
          <p className="text-muted-foreground">Cadastre um novo empreendimento imobiliário</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Auto-save indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {autoSaving ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Salvando rascunho...
                  </>
                ) : lastSaved ? (
                  <>
                    <Save className="h-4 w-4" />
                    Salvo em {lastSaved.toLocaleTimeString()}
                  </>
                ) : null}
              </div>
            </div>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Nome do Empreendimento *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => {
                        const oldValue = title
                        setTitle(e.target.value)
                        logChange("title", oldValue, e.target.value)
                      }}
                      placeholder="Ex: Residencial Jardim das Flores"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyType">Tipo de Empreendimento</Label>
                    <Select
                      value={propertyType}
                      onValueChange={(value) => {
                        logChange("propertyType", propertyType, value)
                        setPropertyType(value)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residencial">Residencial</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="misto">Misto</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => {
                      const oldValue = description
                      setDescription(e.target.value)
                      logChange("description", oldValue, e.target.value)
                    }}
                    placeholder="Descreva o empreendimento..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => {
                      const oldValue = address
                      setAddress(e.target.value)
                      logChange("address", oldValue, e.target.value)
                    }}
                    placeholder="Rua, número, bairro"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => {
                        const oldValue = city
                        setCity(e.target.value)
                        logChange("city", oldValue, e.target.value)
                      }}
                      placeholder="Cidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => {
                        const oldValue = state
                        setState(e.target.value)
                        logChange("state", oldValue, e.target.value)
                      }}
                      placeholder="UF"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => {
                        const oldValue = zipCode
                        setZipCode(e.target.value)
                        logChange("zipCode", oldValue, e.target.value)
                      }}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Developer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Construtora</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="developerName">Nome da Construtora</Label>
                    <Input
                      id="developerName"
                      value={developerName}
                      onChange={(e) => {
                        const oldValue = developerName
                        setDeveloperName(e.target.value)
                        logChange("developerName", oldValue, e.target.value)
                      }}
                      placeholder="Ex: Construtora ABC"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnershipManager">Gerente de Parceria</Label>
                    <Input
                      id="partnershipManager"
                      value={partnershipManager}
                      onChange={(e) => {
                        const oldValue = partnershipManager
                        setPartnershipManager(e.target.value)
                        logChange("partnershipManager", oldValue, e.target.value)
                      }}
                      placeholder="Nome do responsável"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planejamento">Planejamento</SelectItem>
                        <SelectItem value="lancamento">Lançamento</SelectItem>
                        <SelectItem value="construcao">Em Construção</SelectItem>
                        <SelectItem value="entregue">Entregue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="totalUnits">Total de Unidades</Label>
                    <Input
                      id="totalUnits"
                      type="number"
                      value={totalUnits}
                      onChange={(e) => {
                        const oldValue = totalUnits
                        setTotalUnits(e.target.value)
                        logChange("totalUnits", oldValue, e.target.value)
                      }}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryDate">Previsão de Entrega</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => {
                        const oldValue = deliveryDate
                        setDeliveryDate(e.target.value)
                        logChange("deliveryDate", oldValue, e.target.value)
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typologies */}
            <Card>
              <CardHeader>
                <CardTitle>Tipologias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="typologyName">Nome da Tipologia</Label>
                    <Input
                      id="typologyName"
                      value={newTypologyName}
                      onChange={(e) => setNewTypologyName(e.target.value)}
                      placeholder="Ex: 2 Quartos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="typologyValue">Valor</Label>
                    <Input
                      id="typologyValue"
                      value={newTypologyValue}
                      onChange={(e) => setNewTypologyValue(e.target.value)}
                      placeholder="Ex: R$ 350.000"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" onClick={addTypology} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>

                {typologies.length > 0 && (
                  <div className="space-y-2">
                    <Label>Tipologias Cadastradas</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {typologies.map((typology) => (
                        <div key={typology.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{typology.name}</div>
                            <div className="text-sm text-muted-foreground">{typology.value}</div>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeTypology(typology.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Imagens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="images">Upload de Imagens</Label>
                  <div className="mt-2">
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("images")?.click()}
                      disabled={uploadingImages}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingImages ? "Enviando..." : "Selecionar Imagens"}
                    </Button>
                  </div>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || !title.trim()}>
                {isSubmitting ? "Criando..." : "Criar Empreendimento"}
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Change Log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Histórico de Alterações</CardTitle>
            </CardHeader>
            <CardContent>
              {changeLog.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma alteração ainda</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {changeLog.slice(0, 10).map((change) => (
                    <div key={change.id} className="text-xs p-2 bg-muted rounded">
                      <div className="font-medium">{change.field}</div>
                      <div className="text-muted-foreground">{new Date(change.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Dicas</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 text-blue-500" />
                <p>O sistema salva automaticamente suas alterações a cada 2 segundos.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 text-green-500" />
                <p>Adicione múltiplas tipologias para empreendimentos complexos.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 text-orange-500" />
                <p>Imagens ajudam na apresentação do empreendimento.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
