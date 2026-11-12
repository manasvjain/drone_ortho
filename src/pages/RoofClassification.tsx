import { useState } from 'react'
import {
  Home as HomeIcon,
  AlertCircle,
  ChevronDown,
  Filter,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import WorkspaceLayout from '../components/WorkspaceLayout'

const roofTypes = [
  { type: 'Flat / RCC', count: 62, color: '#D66B45', percent: 42.2 },
  { type: 'Pitched / Gabled', count: 38, color: '#D8AC4B', percent: 25.9 },
  { type: 'Metal Sheet', count: 24, color: '#4B9EAA', percent: 16.3 },
  { type: 'Thatched', count: 12, color: '#82966B', percent: 8.2 },
  { type: 'Hip', count: 7, color: '#A9A597', percent: 4.8 },
  { type: 'Dome', count: 2, color: '#5A5C52', percent: 1.4 },
  { type: 'Other', count: 2, color: '#C5C1B4', percent: 1.4 },
]

const buildingRoofs = [
  { id: 'B001', area: 98.4, roofType: 'Flat / RCC', material: 'Reinforced Cement Concrete', condition: 'Good', conf: 0.92 },
  { id: 'B002', area: 112.7, roofType: 'Pitched / Gabled', material: 'Clay Tiles', condition: 'Fair', conf: 0.88 },
  { id: 'B003', area: 245.2, roofType: 'Flat / RCC', material: 'Reinforced Cement Concrete', condition: 'Good', conf: 0.91 },
  { id: 'B004', area: 76.1, roofType: 'Metal Sheet', material: 'Galvanized Iron', condition: 'Fair', conf: 0.87 },
  { id: 'B005', area: 520.8, roofType: 'Flat / RCC', material: 'Reinforced Cement Concrete', condition: 'Good', conf: 0.94 },
  { id: 'B006', area: 89.3, roofType: 'Thatched', material: 'Palm Leaves', condition: 'Poor', conf: 0.83 },
  { id: 'B007', area: 134.5, roofType: 'Pitched / Gabled', material: 'Mangalore Tiles', condition: 'Good', conf: 0.90 },
  { id: 'B008', area: 310.4, roofType: 'Metal Sheet', material: 'Galvanized Iron', condition: 'Good', conf: 0.86 },
  { id: 'B009', area: 67.8, roofType: 'Flat / RCC', material: 'Reinforced Cement Concrete', condition: 'Fair', conf: 0.89 },
  { id: 'B010', area: 155.2, roofType: 'Hip', material: 'Clay Tiles', condition: 'Good', conf: 0.85 },
]

export default function RoofClassification() {
  const [filterType, setFilterType] = useState<string>('all')

  const filtered = filterType === 'all'
    ? buildingRoofs
    : buildingRoofs.filter((b) => b.roofType === filterType)

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Good': return 'text-success'
      case 'Fair': return 'text-road-dark'
      case 'Poor': return 'text-error'
      default: return 'text-text-muted'
    }
  }

  return (
    <WorkspaceLayout title="Roof Classification" subtitle="Building roof type identification and material analysis">
      {/* Demo banner */}
      <div className="bg-road/10 border border-road/30 px-4 py-2 mb-4 flex items-center gap-2">
        <AlertCircle size={13} className="text-road-dark" />
        <span className="text-[0.6875rem] text-terrain-700">
          Demonstration data — classification results are simulated.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Distribution Chart */}
        <div className="card p-4 lg:col-span-2">
          <div className="label-section mb-1">Roof Type Distribution</div>
          <span className="text-[0.8125rem] font-medium text-text">
            Classification across 147 detected buildings
          </span>
          <div className="h-[240px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roofTypes} layout="vertical" barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DB" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#77796F', fontFamily: 'JetBrains Mono' }}
                  axisLine={{ stroke: '#E8E5DB' }}
                  tickLine={false}
                />
                <YAxis
                  dataKey="type"
                  type="category"
                  tick={{ fontSize: 11, fill: '#77796F', fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    background: '#182B26',
                    border: 'none',
                    borderRadius: 2,
                    color: '#F3F0E8',
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [value, 'Count']}
                />
                <Bar dataKey="count" radius={[0, 2, 2, 0]}>
                  {roofTypes.map((entry) => (
                    <Cell key={entry.type} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex flex-col gap-4">
          <div className="card p-4">
            <div className="label-section mb-3">Classification Summary</div>
            {roofTypes.map((rt) => (
              <div key={rt.type} className="flex items-center justify-between py-1.5 border-b border-boundary last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2" style={{ background: rt.color }} />
                  <span className="text-[0.75rem] text-text">{rt.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.75rem] text-text-muted">{rt.percent}%</span>
                  <span className="font-mono text-[0.75rem] text-text font-medium w-6 text-right">
                    {rt.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-4">
            <div className="label-section mb-3">Model Info</div>
            <div className="flex flex-col gap-2">
              {[
                ['Architecture', 'ResNet-18 + FC Head'],
                ['Input Size', '224 × 224 px'],
                ['Categories', '7 roof types'],
                ['Accuracy', '87.3%'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[0.75rem] text-text-muted">{label}</span>
                  <span className="font-mono text-[0.75rem] text-text">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="card">
        <div className="flex items-center justify-between p-4 border-b border-boundary">
          <div>
            <div className="label-section mb-1">Building Roof Details</div>
            <span className="text-[0.8125rem] font-medium text-text">
              Per-building classification results
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-text-muted" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-[0.75rem] border border-boundary bg-white px-2 py-1 font-sans text-text"
            >
              <option value="all">All Types</option>
              {roofTypes.map((rt) => (
                <option key={rt.type} value={rt.type}>{rt.type}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Building ID</th>
                <th>Roof Area (m²)</th>
                <th>Roof Type</th>
                <th>Material</th>
                <th>Condition</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td className="font-mono text-[0.75rem]">{b.id}</td>
                  <td className="font-mono">{b.area.toFixed(1)}</td>
                  <td>
                    <span className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2"
                        style={{ background: roofTypes.find((r) => r.type === b.roofType)?.color }}
                      />
                      {b.roofType}
                    </span>
                  </td>
                  <td className="text-[0.8125rem] text-text-muted">{b.material}</td>
                  <td className={`text-[0.8125rem] font-medium ${getConditionColor(b.condition)}`}>
                    {b.condition}
                  </td>
                  <td className={`font-mono ${b.conf >= 0.9 ? 'confidence-high' : b.conf >= 0.85 ? 'confidence-mid' : 'confidence-low'}`}>
                    {b.conf.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
