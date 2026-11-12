import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Route,
  Droplets,
  TreePine,
  Clock,
  ArrowRight,
  Upload,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import WorkspaceLayout from '../components/WorkspaceLayout'

// Demo data
const featureDistribution = [
  { name: 'Buildings', count: 147, color: '#D66B45' },
  { name: 'Roads', count: 23, color: '#D8AC4B' },
  { name: 'Water', count: 3, color: '#4B9EAA' },
  { name: 'Vegetation', count: 12, color: '#82966B' },
]

const recentActivity = [
  { id: 'ORD-2024-001', name: 'Village_Sector_A_Orthophoto.tif', status: 'completed', time: '2 hours ago', features: 185 },
  { id: 'ORD-2024-002', name: 'Survey_Block_NW_42.jpg', status: 'completed', time: '5 hours ago', features: 93 },
  { id: 'ORD-2024-003', name: 'Drone_Capture_11Oct.png', status: 'processing', time: '12 min ago', features: null },
  { id: 'ORD-2024-004', name: 'GeoTIFF_Block_East.tif', status: 'queued', time: 'Just now', features: null },
]

const coverageData = [
  { name: 'Vegetation', value: 34.2, color: '#82966B' },
  { name: 'Built-up', value: 28.5, color: '#D66B45' },
  { name: 'Roads', value: 12.3, color: '#D8AC4B' },
  { name: 'Water', value: 5.8, color: '#4B9EAA' },
  { name: 'Open', value: 19.2, color: '#C5C1B4' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <WorkspaceLayout title="Operations Overview" subtitle="TERRASCOPE Geospatial Workspace · Demonstration Data">
      {/* Demo banner */}
      <div className="bg-road/10 border border-road/30 px-4 py-2.5 mb-6 flex items-center gap-2">
        <AlertCircle size={14} className="text-road-dark" />
        <span className="text-[0.75rem] text-terrain-700">
          Displaying demonstration data. Upload an orthophoto to generate real analysis results.
        </span>
        <button
          onClick={() => navigate('/workspace/upload')}
          className="ml-auto text-[0.75rem] font-medium text-building hover:text-building-dark flex items-center gap-1 bg-transparent border-none cursor-pointer"
        >
          Upload Image <ArrowRight size={12} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Orthophotos Processed', value: '12', icon: Layers, accent: 'border-t-terrain-700' },
          { label: 'Buildings Detected', value: '1,247', icon: Building2, accent: 'border-t-building' },
          { label: 'Road Length (m)', value: '4,230', icon: Route, accent: 'border-t-road' },
          { label: 'Water Area (m²)', value: '2,840', icon: Droplets, accent: 'border-t-water' },
          { label: 'Vegetation (%)', value: '34.2', icon: TreePine, accent: 'border-t-vegetation' },
        ].map((stat) => (
          <div key={stat.label} className={`card p-4 border-t-2 ${stat.accent}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="stat-label">{stat.label}</span>
              <stat.icon size={15} className="text-terrain-400" strokeWidth={1.5} />
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Feature Distribution Chart */}
        <div className="card p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="label-section mb-1">Feature Distribution</div>
              <span className="text-[0.8125rem] font-medium text-text">
                Extracted Features by Category
              </span>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureDistribution} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DB" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#77796F', fontFamily: 'Inter' }}
                  axisLine={{ stroke: '#E8E5DB' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#77796F', fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#182B26',
                    border: 'none',
                    borderRadius: 2,
                    color: '#F3F0E8',
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {featureDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Land Cover Pie */}
        <div className="card p-4">
          <div className="label-section mb-1">Land Cover Analysis</div>
          <span className="text-[0.8125rem] font-medium text-text">Coverage Breakdown</span>
          <div className="h-[180px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coverageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {coverageData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#182B26',
                    border: 'none',
                    borderRadius: 2,
                    color: '#F3F0E8',
                    fontSize: 12,
                  }}
                  formatter={(value: number) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {coverageData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2" style={{ background: item.color }} />
                <span className="text-[0.6875rem] text-text-muted">{item.name}</span>
                <span className="text-[0.6875rem] font-mono text-text ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="card p-4 lg:col-span-2">
          <div className="label-section mb-3">Recent Processing Activity</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Filename</th>
                <th>Status</th>
                <th>Time</th>
                <th>Features</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono text-[0.75rem]">{item.id}</td>
                  <td className="text-[0.8125rem]">{item.name}</td>
                  <td>
                    <span className="flex items-center gap-1.5">
                      {item.status === 'completed' && (
                        <CheckCircle2 size={12} className="text-success" />
                      )}
                      {item.status === 'processing' && (
                        <Loader2 size={12} className="text-road animate-spin" />
                      )}
                      {item.status === 'queued' && (
                        <Clock size={12} className="text-text-muted" />
                      )}
                      <span className="text-[0.75rem] capitalize">{item.status}</span>
                    </span>
                  </td>
                  <td className="text-[0.75rem] text-text-muted">{item.time}</td>
                  <td className="font-mono text-[0.75rem]">{item.features ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions + Preview */}
        <div className="flex flex-col gap-4">
          <div className="card p-4">
            <div className="label-section mb-3">Quick Actions</div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/workspace/upload')}
                className="btn-primary w-full justify-center text-[0.75rem]"
              >
                <Upload size={14} />
                Upload New Orthophoto
              </button>
              <button
                onClick={() => navigate('/workspace/extraction')}
                className="btn-secondary w-full justify-center text-[0.75rem]"
              >
                <Layers size={14} />
                View Extraction Results
              </button>
            </div>
          </div>

          <div className="card p-1.5 flex-1">
            <img
              src="/hero-orthophoto.jpg"
              alt="Most recent orthophoto"
              className="w-full h-full object-cover block min-h-[140px]"
            />
            <div className="p-3">
              <div className="label-technical">Latest Orthophoto</div>
              <div className="text-[0.8125rem] font-medium text-text mt-1">
                Village_Sector_A
              </div>
              <div className="coordinate mt-0.5">
                27.1751° N, 78.0421° E
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
