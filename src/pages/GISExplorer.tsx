import { useState, useEffect } from 'react'
import {
  Map as MapIcon,
  Layers,
  Download,
  Eye,
  EyeOff,
  Maximize2,
  AlertCircle,
  Building2,
  Route,
  Droplets,
  TreePine,
  Grid3x3,
  Navigation,
  ZoomIn,
} from 'lucide-react'
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import WorkspaceLayout from '../components/WorkspaceLayout'

// GeoJSON demo data
const buildingsGeoJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { id: 'B001', type: 'Residential', area_sqm: 98.4, confidence: 0.94 }, geometry: { type: 'Polygon', coordinates: [[[78.0415, 27.1748], [78.0420, 27.1748], [78.0420, 27.1752], [78.0415, 27.1752], [78.0415, 27.1748]]] } },
    { type: 'Feature', properties: { id: 'B002', type: 'Residential', area_sqm: 112.7, confidence: 0.91 }, geometry: { type: 'Polygon', coordinates: [[[78.0425, 27.1745], [78.0432, 27.1745], [78.0432, 27.1750], [78.0425, 27.1750], [78.0425, 27.1745]]] } },
    { type: 'Feature', properties: { id: 'B003', type: 'Commercial', area_sqm: 245.2, confidence: 0.89 }, geometry: { type: 'Polygon', coordinates: [[[78.0435, 27.1752], [78.0443, 27.1752], [78.0443, 27.1758], [78.0435, 27.1758], [78.0435, 27.1752]]] } },
    { type: 'Feature', properties: { id: 'B004', type: 'Institutional', area_sqm: 520.8, confidence: 0.87 }, geometry: { type: 'Polygon', coordinates: [[[78.0410, 27.1758], [78.0422, 27.1758], [78.0422, 27.1766], [78.0410, 27.1766], [78.0410, 27.1758]]] } },
    { type: 'Feature', properties: { id: 'B005', type: 'Residential', area_sqm: 76.1, confidence: 0.96 }, geometry: { type: 'Polygon', coordinates: [[[78.0440, 27.1740], [78.0446, 27.1740], [78.0446, 27.1745], [78.0440, 27.1745], [78.0440, 27.1740]]] } },
  ],
}

const waterGeoJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { id: 'W001', type: 'Pond', area_sqm: 1420.5 }, geometry: { type: 'Polygon', coordinates: [[[78.0428, 27.1730], [78.0438, 27.1728], [78.0442, 27.1735], [78.0436, 27.1740], [78.0428, 27.1738], [78.0428, 27.1730]]] } },
  ],
}

const roadsGeoJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { id: 'R001', type: 'Primary', length_m: 342.5 }, geometry: { type: 'LineString', coordinates: [[78.0400, 27.1750], [78.0415, 27.1752], [78.0430, 27.1748], [78.0450, 27.1750]] } },
    { type: 'Feature', properties: { id: 'R002', type: 'Secondary', length_m: 218.3 }, geometry: { type: 'LineString', coordinates: [[78.0420, 27.1735], [78.0422, 27.1745], [78.0425, 27.1758], [78.0423, 27.1770]] } },
  ],
}

const vegetationGeoJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { id: 'V001', type: 'Tree Cluster', area_sqm: 3420.1 }, geometry: { type: 'Polygon', coordinates: [[[78.0400, 27.1760], [78.0412, 27.1762], [78.0410, 27.1772], [78.0398, 27.1770], [78.0400, 27.1760]]] } },
    { type: 'Feature', properties: { id: 'V002', type: 'Cropland', area_sqm: 5840.3 }, geometry: { type: 'Polygon', coordinates: [[[78.0445, 27.1760], [78.0460, 27.1758], [78.0462, 27.1775], [78.0448, 27.1773], [78.0445, 27.1760]]] } },
  ],
}

interface LayerConfig {
  key: string
  label: string
  color: string
  icon: typeof Building2
  data: GeoJSON.FeatureCollection
  visible: boolean
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  return null
}

export default function GISExplorer() {
  const [layers, setLayers] = useState<LayerConfig[]>([
    { key: 'buildings', label: 'Buildings', color: '#D66B45', icon: Building2, data: buildingsGeoJSON, visible: true },
    { key: 'roads', label: 'Roads', color: '#D8AC4B', icon: Route, data: roadsGeoJSON, visible: true },
    { key: 'water', label: 'Water Bodies', color: '#4B9EAA', icon: Droplets, data: waterGeoJSON, visible: true },
    { key: 'vegetation', label: 'Vegetation', color: '#82966B', icon: TreePine, data: vegetationGeoJSON, visible: true },
  ])

  const [selectedFeature, setSelectedFeature] = useState<any>(null)

  const toggleLayer = (key: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.key === key ? { ...l, visible: !l.visible } : l))
    )
  }

  const center: [number, number] = [27.1750, 78.0425]

  return (
    <WorkspaceLayout title="GIS Explorer" subtitle="Interactive geospatial visualization and feature inspection">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-11rem)]">
        {/* Sidebar Controls */}
        <div className="flex flex-col gap-4 overflow-auto">
          {/* Demo banner */}
          <div className="bg-road/10 border border-road/30 px-3 py-2 flex items-center gap-2">
            <AlertCircle size={12} className="text-road-dark shrink-0" />
            <span className="text-[0.625rem] text-terrain-700">
              Demo GeoJSON features displayed
            </span>
          </div>

          {/* Layer Controls */}
          <div className="card p-4">
            <div className="label-section mb-3">Map Layers</div>
            {layers.map((layer) => (
              <div
                key={layer.key}
                className="flex items-center justify-between py-2.5 border-b border-boundary last:border-0"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ background: layer.color }} />
                  <span className="text-[0.8125rem] text-text">{layer.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[0.625rem] text-text-muted">
                    {layer.data.features.length}
                  </span>
                  <button
                    onClick={() => toggleLayer(layer.key)}
                    className="bg-transparent border-none cursor-pointer p-1 hover:bg-surface-alt transition-colors"
                  >
                    {layer.visible ? (
                      <Eye size={14} className="text-terrain-600" />
                    ) : (
                      <EyeOff size={14} className="text-terrain-300" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CRS Info */}
          <div className="card p-4">
            <div className="label-section mb-3">Coordinate Reference</div>
            <div className="flex flex-col gap-2">
              {[
                ['CRS', 'EPSG:4326'],
                ['Datum', 'WGS 84'],
                ['Center', '27.175°N, 78.043°E'],
                ['Projection', 'Geographic'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[0.6875rem] text-text-muted">{label}</span>
                  <span className="font-mono text-[0.6875rem] text-text">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Feature Info */}
          {selectedFeature && (
            <div className="card p-4">
              <div className="label-section mb-3">Selected Feature</div>
              {Object.entries(selectedFeature).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-1 border-b border-boundary last:border-0">
                  <span className="text-[0.6875rem] text-text-muted capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="font-mono text-[0.6875rem] text-text">{String(value)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Export */}
          <div className="card p-4">
            <div className="label-section mb-3">Export GIS Data</div>
            <div className="flex flex-col gap-2">
              <button className="btn-secondary w-full justify-center text-[0.75rem]">
                <Download size={13} />
                GeoJSON (All Layers)
              </button>
              <button className="btn-secondary w-full justify-center text-[0.75rem]">
                <Download size={13} />
                Shapefile (.shp)
              </button>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3 card overflow-hidden relative">
          <MapContainer
            center={center}
            zoom={16}
            className="w-full h-full min-h-[500px]"
            zoomControl={true}
          >
            <MapController center={center} zoom={16} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {layers.filter((l) => l.visible).map((layer) => (
              <GeoJSON
                key={layer.key + String(layer.visible)}
                data={layer.data}
                style={() => ({
                  color: layer.color,
                  weight: layer.key === 'roads' ? 3 : 2,
                  fillColor: layer.color,
                  fillOpacity: layer.key === 'roads' ? 0 : 0.3,
                })}
                onEachFeature={(feature, leafletLayer) => {
                  leafletLayer.on('click', () => {
                    setSelectedFeature(feature.properties)
                  })
                  const props = feature.properties
                  const popupContent = Object.entries(props || {})
                    .map(([k, v]) => `<div style="display:flex;justify-content:space-between;gap:12px;font-size:11px;padding:1px 0;"><span style="color:#77796F;text-transform:capitalize">${k.replace(/_/g, ' ')}</span><span style="font-family:monospace;color:#202B27">${v}</span></div>`)
                    .join('')
                  leafletLayer.bindPopup(`<div style="min-width:180px">${popupContent}</div>`)
                }}
              />
            ))}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-boundary p-3 z-[1000]">
            <div className="label-technical mb-2">Feature Legend</div>
            {layers.filter((l) => l.visible).map((layer) => (
              <div key={layer.key} className="flex items-center gap-2 py-0.5">
                <div className="w-3 h-1" style={{ background: layer.color }} />
                <span className="text-[0.625rem] text-text">{layer.label}</span>
              </div>
            ))}
          </div>

          {/* Coordinate Display */}
          <div className="absolute top-3 right-3 bg-nav/90 backdrop-blur-sm text-terrain-50 px-3 py-1.5 font-mono text-[0.6875rem] z-[1000]">
            <Navigation size={10} className="inline mr-1.5" />
            27.1750° N, 78.0425° E
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
