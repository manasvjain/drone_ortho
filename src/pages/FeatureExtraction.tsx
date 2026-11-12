import { useState } from 'react'
import {
  Building2,
  Route,
  Droplets,
  TreePine,
  Grid3x3,
  Eye,
  EyeOff,
  Download,
  Filter,
  ChevronDown,
  AlertCircle,
} from 'lucide-react'
import WorkspaceLayout from '../components/WorkspaceLayout'

// Demo extraction results
const DEMO = {
  buildings: [
    { id: 'B001', type: 'Residential', area: 98.4, perimeter: 42.1, cx: 78.0421, cy: 27.1751, conf: 0.94 },
    { id: 'B002', type: 'Residential', area: 112.7, perimeter: 45.8, cx: 78.0425, cy: 27.1748, conf: 0.91 },
    { id: 'B003', type: 'Commercial', area: 245.2, perimeter: 68.3, cx: 78.0430, cy: 27.1755, conf: 0.89 },
    { id: 'B004', type: 'Residential', area: 76.1, perimeter: 35.2, cx: 78.0418, cy: 27.1762, conf: 0.96 },
    { id: 'B005', type: 'Institutional', area: 520.8, perimeter: 98.4, cx: 78.0435, cy: 27.1745, conf: 0.87 },
    { id: 'B006', type: 'Residential', area: 89.3, perimeter: 38.6, cx: 78.0422, cy: 27.1758, conf: 0.93 },
    { id: 'B007', type: 'Residential', area: 134.5, perimeter: 48.2, cx: 78.0428, cy: 27.1743, conf: 0.90 },
    { id: 'B008', type: 'Commercial', area: 310.4, perimeter: 72.1, cx: 78.0432, cy: 27.1760, conf: 0.88 },
  ],
  roads: [
    { id: 'R001', type: 'Primary', length: 342.5, width: 6.0, conf: 0.92 },
    { id: 'R002', type: 'Secondary', length: 218.3, width: 4.0, conf: 0.88 },
    { id: 'R003', type: 'Tertiary', length: 156.7, width: 3.0, conf: 0.85 },
    { id: 'R004', type: 'Lane', length: 89.4, width: 2.5, conf: 0.82 },
    { id: 'R005', type: 'Secondary', length: 275.1, width: 4.5, conf: 0.90 },
  ],
  water: [
    { id: 'W001', type: 'Pond', area: 1420.5, perimeter: 142.3, cx: 78.0440, cy: 27.1760, conf: 0.93 },
    { id: 'W002', type: 'Canal', area: 890.3, perimeter: 320.1, cx: 78.0415, cy: 27.1740, conf: 0.90 },
    { id: 'W003', type: 'Drain', area: 529.4, perimeter: 245.6, cx: 78.0428, cy: 27.1770, conf: 0.86 },
  ],
  vegetation: [
    { id: 'V001', type: 'Tree Cluster', area: 3420.1, cx: 78.0422, cy: 27.1758, conf: 0.91 },
    { id: 'V002', type: 'Cropland', area: 5840.3, cx: 78.0445, cy: 27.1735, conf: 0.88 },
    { id: 'V003', type: 'Grass', area: 3390.4, cx: 78.0412, cy: 27.1768, conf: 0.84 },
  ],
}

const layers = [
  { key: 'buildings', label: 'Buildings', color: '#D66B45', icon: Building2, count: 147 },
  { key: 'roads', label: 'Roads', color: '#D8AC4B', icon: Route, count: 23 },
  { key: 'water', label: 'Water Bodies', color: '#4B9EAA', icon: Droplets, count: 3 },
  { key: 'vegetation', label: 'Vegetation', color: '#82966B', icon: TreePine, count: 12 },
  { key: 'boundaries', label: 'Boundaries', color: '#5A5C52', icon: Grid3x3, count: 89 },
]

type TabKey = 'buildings' | 'roads' | 'water' | 'vegetation'

export default function FeatureExtraction() {
  const [activeTab, setActiveTab] = useState<TabKey>('buildings')
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    buildings: true,
    roads: true,
    water: true,
    vegetation: true,
    boundaries: true,
  })

  const toggleLayer = (key: string) => {
    setVisibleLayers((v) => ({ ...v, [key]: !v[key] }))
  }

  const getConfidenceClass = (conf: number) => {
    if (conf >= 0.9) return 'confidence-high'
    if (conf >= 0.8) return 'confidence-mid'
    return 'confidence-low'
  }

  return (
    <WorkspaceLayout title="Feature Extraction" subtitle="Semantic segmentation results and extracted features">
      {/* Demo banner */}
      <div className="bg-road/10 border border-road/30 px-4 py-2 mb-4 flex items-center gap-2">
        <AlertCircle size={13} className="text-road-dark" />
        <span className="text-[0.6875rem] text-terrain-700">
          Demonstration data — results shown are simulated for UI development purposes.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Layer Controls */}
        <div className="flex flex-col gap-4">
          <div className="card p-4">
            <div className="label-section mb-3">Overlay Layers</div>
            {layers.map((layer) => (
              <div
                key={layer.key}
                className="flex items-center justify-between py-2 border-b border-boundary last:border-0"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5" style={{ background: layer.color }} />
                  <span className="text-[0.8125rem] text-text">{layer.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[0.6875rem] text-text-muted">
                    {layer.count}
                  </span>
                  <button
                    onClick={() => toggleLayer(layer.key)}
                    className="bg-transparent border-none cursor-pointer p-0.5"
                  >
                    {visibleLayers[layer.key] ? (
                      <Eye size={14} className="text-terrain-500" />
                    ) : (
                      <EyeOff size={14} className="text-terrain-300" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="card p-4">
            <div className="label-section mb-3">Analysis Summary</div>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Total Features', value: '274' },
                { label: 'Mapped Area', value: '36,980 m²' },
                { label: 'Processing Time', value: '4.5 sec' },
                { label: 'Model', value: 'U-Net' },
                { label: 'Mean Confidence', value: '0.89' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-[0.75rem] text-text-muted">{stat.label}</span>
                  <span className="font-mono text-[0.75rem] text-text font-medium">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Export */}
          <div className="card p-4">
            <div className="label-section mb-3">Export</div>
            <div className="flex flex-col gap-2">
              <button className="btn-secondary w-full justify-center text-[0.75rem]">
                <Download size={13} />
                Export GeoJSON
              </button>
              <button className="btn-secondary w-full justify-center text-[0.75rem]">
                <Download size={13} />
                Export Shapefile
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results View */}
        <div className="lg:col-span-3">
          {/* Image workspace with overlays */}
          <div className="card mb-4 overflow-hidden">
            <div className="relative bg-terrain-900">
              <img
                src="/hero-orthophoto.jpg"
                alt="Analysis result"
                className="w-full h-auto block max-h-[420px] object-cover"
              />
              {/* Simulated overlay indicators */}
              {visibleLayers.buildings && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Building overlay dots */}
                  {[
                    { top: '30%', left: '35%' },
                    { top: '35%', left: '45%' },
                    { top: '40%', left: '55%' },
                    { top: '25%', left: '60%' },
                    { top: '45%', left: '40%' },
                    { top: '50%', left: '50%' },
                    { top: '35%', left: '65%' },
                    { top: '55%', left: '35%' },
                  ].map((pos, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 border-2 border-building bg-building/20"
                      style={{ top: pos.top, left: pos.left }}
                    />
                  ))}
                </div>
              )}
              {visibleLayers.water && (
                <div className="absolute pointer-events-none"
                  style={{ top: '65%', left: '40%', width: '12%', height: '10%', border: '2px solid #4B9EAA', background: 'rgba(75,158,170,0.2)' }}
                />
              )}
              {visibleLayers.roads && (
                <div className="absolute pointer-events-none"
                  style={{ top: '35%', left: '28%', width: '45%', height: '2px', background: '#D8AC4B', transform: 'rotate(-5deg)' }}
                />
              )}

              {/* Coordinate readout */}
              <div className="absolute bottom-3 left-3 bg-nav/90 backdrop-blur-sm text-terrain-50 px-3 py-1.5 font-mono text-[0.6875rem]">
                27.1751° N, 78.0421° E · EPSG:4326
              </div>
              <div className="absolute bottom-3 right-3 bg-nav/90 backdrop-blur-sm text-terrain-50 px-3 py-1.5 font-mono text-[0.6875rem]">
                147 buildings · 23 road segments · 3 water bodies
              </div>
            </div>
          </div>

          {/* Feature Data Table */}
          <div className="card">
            {/* Tabs */}
            <div className="flex border-b border-boundary">
              {(['buildings', 'roads', 'water', 'vegetation'] as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-[0.8125rem] font-medium capitalize bg-transparent border-none cursor-pointer border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-b-building text-text'
                      : 'border-b-transparent text-text-muted hover:text-text'
                  }`}
                >
                  {tab === 'water' ? 'Water Bodies' : tab}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {activeTab === 'buildings' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Feature ID</th>
                      <th>Type</th>
                      <th>Area (m²)</th>
                      <th>Perimeter (m)</th>
                      <th>Centroid</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO.buildings.map((b) => (
                      <tr key={b.id}>
                        <td className="font-mono text-[0.75rem]">{b.id}</td>
                        <td>{b.type}</td>
                        <td className="font-mono">{b.area.toFixed(1)}</td>
                        <td className="font-mono">{b.perimeter.toFixed(1)}</td>
                        <td className="coordinate">{b.cy.toFixed(4)}°N, {b.cx.toFixed(4)}°E</td>
                        <td className={`font-mono ${getConfidenceClass(b.conf)}`}>
                          {b.conf.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'roads' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Feature ID</th>
                      <th>Type</th>
                      <th>Length (m)</th>
                      <th>Width (m)</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO.roads.map((r) => (
                      <tr key={r.id}>
                        <td className="font-mono text-[0.75rem]">{r.id}</td>
                        <td>{r.type}</td>
                        <td className="font-mono">{r.length.toFixed(1)}</td>
                        <td className="font-mono">{r.width.toFixed(1)}</td>
                        <td className={`font-mono ${getConfidenceClass(r.conf)}`}>
                          {r.conf.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'water' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Feature ID</th>
                      <th>Type</th>
                      <th>Area (m²)</th>
                      <th>Perimeter (m)</th>
                      <th>Centroid</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO.water.map((w) => (
                      <tr key={w.id}>
                        <td className="font-mono text-[0.75rem]">{w.id}</td>
                        <td>{w.type}</td>
                        <td className="font-mono">{w.area.toFixed(1)}</td>
                        <td className="font-mono">{w.perimeter.toFixed(1)}</td>
                        <td className="coordinate">{w.cy.toFixed(4)}°N, {w.cx.toFixed(4)}°E</td>
                        <td className={`font-mono ${getConfidenceClass(w.conf)}`}>
                          {w.conf.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === 'vegetation' && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Feature ID</th>
                      <th>Type</th>
                      <th>Area (m²)</th>
                      <th>Centroid</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO.vegetation.map((v) => (
                      <tr key={v.id}>
                        <td className="font-mono text-[0.75rem]">{v.id}</td>
                        <td>{v.type}</td>
                        <td className="font-mono">{v.area.toFixed(1)}</td>
                        <td className="coordinate">{v.cy.toFixed(4)}°N, {v.cx.toFixed(4)}°E</td>
                        <td className={`font-mono ${getConfidenceClass(v.conf)}`}>
                          {v.conf.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
