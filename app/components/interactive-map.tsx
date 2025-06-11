"use client"

import type React from "react"

import { useRef, useState } from "react"
import { ZoomIn, ZoomOut, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface MapComponentProps {
  currentUser: AppUser | null
  alerts: AppAlert[]
  onAlertClick: (alertId: string) => void
}

export default function InteractiveMap({ currentUser, alerts, onAlertClick }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)

  // Marcadores fixos simples - expandidos com mais propriedades e pontos de interesse
  const markers = [
    // Usuário atual
    { id: "user", x: 200, y: 150, type: "user", icon: "👤", title: "Você", desc: "Sua localização atual" },

    // Propriedades rurais
    {
      id: "farm1",
      x: 150,
      y: 100,
      type: "farm",
      icon: "🏠",
      title: "Fazenda São José",
      desc: "João Silva • 120 hectares • Milho, Soja",
    },
    {
      id: "farm2",
      x: 280,
      y: 200,
      type: "farm",
      icon: "🏠",
      title: "Sítio Boa Vista",
      desc: "Maria Santos • 80 hectares • Café, Frutas",
    },
    {
      id: "farm3",
      x: 120,
      y: 220,
      type: "farm",
      icon: "🏠",
      title: "Fazenda Santa Clara",
      desc: "Pedro Costa • 200 hectares • Gado, Pastagem",
    },
    {
      id: "farm4",
      x: 320,
      y: 120,
      type: "farm",
      icon: "🏠",
      title: "Rancho Alegre",
      desc: "Ana Oliveira • 90 hectares • Avicultura",
    },
    {
      id: "farm5",
      x: 100,
      y: 180,
      type: "farm",
      icon: "🏠",
      title: "Sítio Esperança",
      desc: "Carlos Lima • 60 hectares • Hortaliças",
    },
    {
      id: "farm6",
      x: 250,
      y: 80,
      type: "farm",
      icon: "🏠",
      title: "Fazenda Progresso",
      desc: "Roberto Silva • 300 hectares • Soja, Milho",
    },
    {
      id: "farm7",
      x: 350,
      y: 180,
      type: "farm",
      icon: "🏠",
      title: "Chácara Verde",
      desc: "Lucia Ferreira • 40 hectares • Flores, Plantas",
    },

    // Pontos de serviço e comércio
    {
      id: "store1",
      x: 180,
      y: 120,
      type: "service",
      icon: "🏪",
      title: "Agropecuária Central",
      desc: "Loja de insumos e equipamentos",
    },
    {
      id: "store2",
      x: 240,
      y: 160,
      type: "service",
      icon: "🏪",
      title: "Casa do Produtor",
      desc: "Sementes, fertilizantes e rações",
    },
    {
      id: "vet1",
      x: 160,
      y: 180,
      type: "service",
      icon: "🏥",
      title: "Clínica Veterinária Rural",
      desc: "Dr. Fernando - Atendimento 24h",
    },
    {
      id: "mech1",
      x: 220,
      y: 140,
      type: "service",
      icon: "🔧",
      title: "Oficina do Campo",
      desc: "Manutenção de tratores e implementos",
    },

    // Pontos de interesse público
    {
      id: "school1",
      x: 190,
      y: 190,
      type: "public",
      icon: "🏫",
      title: "Escola Rural São Pedro",
      desc: "Ensino fundamental e médio",
    },
    {
      id: "health1",
      x: 210,
      y: 110,
      type: "public",
      icon: "🏥",
      title: "Posto de Saúde Rural",
      desc: "Atendimento básico de saúde",
    },
    {
      id: "church1",
      x: 170,
      y: 200,
      type: "public",
      icon: "⛪",
      title: "Igreja São Francisco",
      desc: "Missas domingos 8h e 19h",
    },
    {
      id: "bank1",
      x: 230,
      y: 130,
      type: "service",
      icon: "🏦",
      title: "Banco do Agricultor",
      desc: "Agência bancária rural",
    },

    // Pontos de infraestrutura
    {
      id: "gas1",
      x: 200,
      y: 100,
      type: "service",
      icon: "⛽",
      title: "Posto Combustível Rural",
      desc: "Diesel, gasolina e álcool",
    },
    {
      id: "coop1",
      x: 260,
      y: 190,
      type: "service",
      icon: "🏢",
      title: "Cooperativa Agrícola",
      desc: "Compra e venda de produtos",
    },
    {
      id: "silo1",
      x: 140,
      y: 140,
      type: "infrastructure",
      icon: "🏭",
      title: "Silo Graneleiro",
      desc: "Armazenamento de grãos",
    },
    {
      id: "water1",
      x: 300,
      y: 150,
      type: "infrastructure",
      icon: "💧",
      title: "Reservatório de Água",
      desc: "Abastecimento regional",
    },

    // Pontos de lazer e comunidade
    {
      id: "club1",
      x: 180,
      y: 210,
      type: "community",
      icon: "🎪",
      title: "Centro Comunitário",
      desc: "Eventos e reuniões da comunidade",
    },
    {
      id: "market1",
      x: 250,
      y: 120,
      type: "service",
      icon: "🛒",
      title: "Mercado Rural",
      desc: "Feira de produtos locais - Sábados",
    },
    {
      id: "radio1",
      x: 160,
      y: 90,
      type: "infrastructure",
      icon: "📻",
      title: "Rádio Comunitária",
      desc: "FM 87.5 - Notícias rurais",
    },
  ]

  // Adicionar alertas como marcadores
  const alertMarkers = alerts.map((alert, index) => ({
    id: `alert-${alert.id}`,
    x: 180 + index * 50,
    y: 130 + index * 40,
    type: alert.status === "open" ? "alert" : "resolved",
    icon: alert.status === "open" ? "🚨" : "✅",
    title: alert.type,
    desc: alert.message,
    alertData: alert,
  }))

  const allMarkers = [...markers, ...alertMarkers]

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === mapRef.current) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      setSelectedMarker(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.5))
  }

  const handleCenterMap = () => {
    setPan({ x: 0, y: 0 })
    setZoom(1)
  }

  const handleMarkerClick = (marker: any) => {
    setSelectedMarker(marker.id)
    if (marker.alertData) {
      onAlertClick(marker.alertData.id)
    }
  }

  return (
    <div className="relative w-full h-full bg-green-50 rounded-lg overflow-hidden border-2 border-green-200">
      {/* Mapa */}
      <div
        ref={mapRef}
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(34, 197, 94, 0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(34, 197, 94, 0.1) 25%, transparent 25%)
          `,
          backgroundSize: "40px 40px",
        }}
      >
        {/* Grade */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: `${50 * zoom}px ${50 * zoom}px`,
            transform: `translate(${pan.x % (50 * zoom)}px, ${pan.y % (50 * zoom)}px)`,
          }}
        />

        {/* Marcadores */}
        {allMarkers.map((marker) => (
          <div
            key={marker.id}
            className="absolute flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
            style={{
              transform: `translate(${marker.x * zoom + pan.x}px, ${marker.y * zoom + pan.y}px) scale(${zoom})`,
              width: "30px",
              height: "30px",
              backgroundColor:
                marker.type === "user"
                  ? "#3B82F6"
                  : marker.type === "farm"
                    ? "#10B981"
                    : marker.type === "service"
                      ? "#8B5CF6"
                      : marker.type === "public"
                        ? "#6366F1"
                        : marker.type === "infrastructure"
                          ? "#6B7280"
                          : marker.type === "community"
                            ? "#EAB308"
                            : marker.type === "alert"
                              ? "#EF4444"
                              : "#F97316",
              borderRadius: "50%",
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              fontSize: "14px",
              zIndex: selectedMarker === marker.id ? 20 : 10,
            }}
            onClick={() => handleMarkerClick(marker)}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {marker.icon}
          </div>
        ))}

        {/* Popup do marcador selecionado */}
        {selectedMarker &&
          (() => {
            const marker = allMarkers.find((m) => m.id === selectedMarker)
            if (!marker) return null

            return (
              <div
                className="absolute bg-white rounded-lg shadow-lg p-3 border-2 border-gray-200 z-30"
                style={{
                  transform: `translate(${marker.x * zoom + pan.x + 35}px, ${marker.y * zoom + pan.y - 60}px)`,
                  minWidth: "200px",
                  maxWidth: "250px",
                }}
              >
                <div className="text-sm font-semibold text-gray-800 mb-1">{marker.title}</div>
                <div className="text-xs text-gray-600 mb-2">{marker.desc}</div>
                {marker.alertData && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">📍 {marker.alertData.location}</div>
                    <div className="text-xs text-gray-500">🕒 {marker.alertData.timestamp.toLocaleTimeString()}</div>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-bold text-white ${
                          marker.alertData.status === "open" ? "bg-red-500" : "bg-orange-500"
                        }`}
                      >
                        {marker.alertData.status === "open" ? "ABERTO" : "RESOLVIDO"}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-300"
                  onClick={() => setSelectedMarker(null)}
                >
                  ×
                </button>
              </div>
            )
          })()}
      </div>

      {/* Controles */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button size="sm" variant="outline" onClick={handleZoomIn} className="bg-white shadow-lg">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleZoomOut} className="bg-white shadow-lg">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleCenterMap} className="bg-white shadow-lg">
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {/* Info */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2 text-xs">
        <div className="font-semibold mb-1">Zoom: {Math.round(zoom * 100)}%</div>
        <div className="text-gray-600">Arraste para navegar</div>
      </div>

      {/* Legenda */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs max-w-48">
        <div className="font-semibold mb-2 text-green-800">Legenda do Mapa:</div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span>Você</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Propriedades</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span>Serviços</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
            <span>Público</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span>Infraestrutura</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span>Comunidade</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Alertas</span>
          </div>
        </div>
      </div>
    </div>
  )
}
