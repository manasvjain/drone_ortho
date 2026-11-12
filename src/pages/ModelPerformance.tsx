import { useState } from 'react'
import {
  BarChart3,
  Cpu,
  Clock,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
  Circle,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import WorkspaceLayout from '../components/WorkspaceLayout'

const models = [
  {
    id: 'unet',
    name: 'U-Net',
    status: 'active',
    params: '31.0M',
    inputSize: '512×512',
    iou: 0.782,
    accuracy: 0.891,
    f1: 0.834,
    inferenceMs: 120,
    trainingHours: 4.2,
    description: 'Encoder-decoder with skip connections. Baseline model.',
  },
  {
    id: 'deeplabv3plus',
    name: 'DeepLabV3+',
    status: 'ready',
    params: '59.3M',
    inputSize: '512×512',
    iou: 0.821,
    accuracy: 0.912,
    f1: 0.867,
    inferenceMs: 185,
    trainingHours: 6.8,
    description: 'Atrous spatial pyramid pooling with decoder refinement.',
  },
  {
    id: 'segformer',
    name: 'SegFormer',
    status: 'ready',
    params: '84.7M',
    inputSize: '512×512',
    iou: 0.856,
    accuracy: 0.928,
    f1: 0.891,
    inferenceMs: 240,
    trainingHours: 8.5,
    description: 'Hierarchical vision transformer for dense prediction.',
  },
]

const perClassIoU = [
  { category: 'Buildings', unet: 0.812, deeplab: 0.854, segformer: 0.891 },
  { category: 'Roads', unet: 0.743, deeplab: 0.798, segformer: 0.832 },
  { category: 'Water', unet: 0.856, deeplab: 0.878, segformer: 0.902 },
  { category: 'Vegetation', unet: 0.718, deeplab: 0.756, segformer: 0.798 },
]

// Generate training curve data
const trainingHistory = Array.from({ length: 80 }, (_, i) => ({
  epoch: i + 1,
  trainLoss: Math.max(0.05, 0.85 * Math.exp(-0.04 * i) + 0.02 * Math.sin(i * 0.5)),
  valLoss: Math.max(0.08, 0.90 * Math.exp(-0.035 * i) + 0.03 * Math.sin(i * 0.4)),
  trainIoU: Math.min(0.89, 0.10 + 0.79 * (1 - Math.exp(-0.05 * i)) + 0.01 * Math.sin(i * 0.3)),
  valIoU: Math.min(0.85, 0.08 + 0.77 * (1 - Math.exp(-0.045 * i)) + 0.015 * Math.sin(i * 0.35)),
}))

const radarData = [
  { metric: 'Buildings IoU', unet: 81, deeplab: 85, segformer: 89 },
  { metric: 'Roads IoU', unet: 74, deeplab: 80, segformer: 83 },
  { metric: 'Water IoU', unet: 86, deeplab: 88, segformer: 90 },
  { metric: 'Vegetation IoU', unet: 72, deeplab: 76, segformer: 80 },
  { metric: 'Speed', unet: 90, deeplab: 72, segformer: 55 },
  { metric: 'Memory Eff.', unet: 88, deeplab: 68, segformer: 52 },
]

export default function ModelPerformance() {
  const [activeModel, setActiveModel] = useState('unet')
  const [chartView, setChartView] = useState<'loss' | 'iou'>('loss')

  return (
    <WorkspaceLayout title="Model Performance" subtitle="Segmentation model metrics, training curves and comparisons">
      {/* Demo banner */}
      <div className="bg-road/10 border border-road/30 px-4 py-2 mb-4 flex items-center gap-2">
        <AlertCircle size={13} className="text-road-dark" />
        <span className="text-[0.6875rem] text-terrain-700">
          Demonstration metrics — values represent expected performance based on architecture benchmarks.
        </span>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {models.map((model) => (
          <div
            key={model.id}
            onClick={() => setActiveModel(model.id)}
            className={`card p-4 cursor-pointer transition-all ${
              activeModel === model.id
                ? 'border-building ring-1 ring-building/20'
                : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-terrain-500" />
                <span className="text-[0.9375rem] font-semibold text-text">{model.name}</span>
              </div>
              <span className={`text-[0.625rem] font-medium uppercase tracking-wider px-2 py-0.5 ${
                model.status === 'active'
                  ? 'bg-success/10 text-success'
                  : 'bg-terrain-200 text-terrain-600'
              }`}>
                {model.status}
              </span>
            </div>
            <p className="text-[0.75rem] text-text-muted m-0 mb-3">{model.description}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Mean IoU', value: model.iou.toFixed(3) },
                { label: 'Accuracy', value: model.accuracy.toFixed(3) },
                { label: 'F1 Score', value: model.f1.toFixed(3) },
                { label: 'Inference', value: `${model.inferenceMs}ms` },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-[0.5625rem] text-text-muted uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="font-mono text-[0.875rem] font-semibold text-text">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Training Curves */}
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="label-section mb-1">Training Curves</div>
              <span className="text-[0.8125rem] font-medium text-text">
                {models.find((m) => m.id === activeModel)?.name} — {chartView === 'loss' ? 'Loss' : 'IoU'}
              </span>
            </div>
            <div className="flex border border-boundary">
              <button
                onClick={() => setChartView('loss')}
                className={`px-3 py-1 text-[0.6875rem] border-none cursor-pointer transition-colors ${
                  chartView === 'loss'
                    ? 'bg-nav text-terrain-50'
                    : 'bg-white text-text-muted hover:bg-surface-alt'
                }`}
              >
                Loss
              </button>
              <button
                onClick={() => setChartView('iou')}
                className={`px-3 py-1 text-[0.6875rem] border-none border-l border-boundary cursor-pointer transition-colors ${
                  chartView === 'iou'
                    ? 'bg-nav text-terrain-50'
                    : 'bg-white text-text-muted hover:bg-surface-alt'
                }`}
              >
                IoU
              </button>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E5DB" />
                <XAxis
                  dataKey="epoch"
                  tick={{ fontSize: 10, fill: '#77796F', fontFamily: 'JetBrains Mono' }}
                  axisLine={{ stroke: '#E8E5DB' }}
                  tickLine={false}
                  label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#77796F' }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#77796F', fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#182B26',
                    border: 'none',
                    borderRadius: 2,
                    color: '#F3F0E8',
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, fontFamily: 'Inter' }}
                />
                {chartView === 'loss' ? (
                  <>
                    <Line type="monotone" dataKey="trainLoss" stroke="#D66B45" name="Train Loss" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="valLoss" stroke="#4B9EAA" name="Val Loss" strokeWidth={1.5} dot={false} />
                  </>
                ) : (
                  <>
                    <Line type="monotone" dataKey="trainIoU" stroke="#D66B45" name="Train IoU" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="valIoU" stroke="#4B9EAA" name="Val IoU" strokeWidth={1.5} dot={false} />
                  </>
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Comparison */}
        <div className="card p-4">
          <div className="label-section mb-1">Model Comparison</div>
          <span className="text-[0.8125rem] font-medium text-text">Multi-Metric Radar</span>
          <div className="h-[280px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E8E5DB" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 10, fill: '#77796F' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fill: '#A9A597' }}
                />
                <Radar name="U-Net" dataKey="unet" stroke="#D66B45" fill="#D66B45" fillOpacity={0.15} strokeWidth={1.5} />
                <Radar name="DeepLabV3+" dataKey="deeplab" stroke="#D8AC4B" fill="#D8AC4B" fillOpacity={0.1} strokeWidth={1.5} />
                <Radar name="SegFormer" dataKey="segformer" stroke="#4B9EAA" fill="#4B9EAA" fillOpacity={0.1} strokeWidth={1.5} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Inter' }} />
                <Tooltip
                  contentStyle={{
                    background: '#182B26',
                    border: 'none',
                    borderRadius: 2,
                    color: '#F3F0E8',
                    fontSize: 11,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Per-Class IoU Table */}
      <div className="card">
        <div className="p-4 border-b border-boundary">
          <div className="label-section mb-1">Per-Class IoU Comparison</div>
          <span className="text-[0.8125rem] font-medium text-text">
            Intersection over Union by feature category
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>U-Net</th>
                <th>DeepLabV3+</th>
                <th>SegFormer</th>
                <th>Best</th>
              </tr>
            </thead>
            <tbody>
              {perClassIoU.map((row) => {
                const best = Math.max(row.unet, row.deeplab, row.segformer)
                const bestModel = best === row.segformer ? 'SegFormer' : best === row.deeplab ? 'DeepLabV3+' : 'U-Net'
                return (
                  <tr key={row.category}>
                    <td className="font-medium">{row.category}</td>
                    <td className={`font-mono ${row.unet === best ? 'text-success font-semibold' : ''}`}>
                      {row.unet.toFixed(3)}
                    </td>
                    <td className={`font-mono ${row.deeplab === best ? 'text-success font-semibold' : ''}`}>
                      {row.deeplab.toFixed(3)}
                    </td>
                    <td className={`font-mono ${row.segformer === best ? 'text-success font-semibold' : ''}`}>
                      {row.segformer.toFixed(3)}
                    </td>
                    <td className="text-[0.75rem] font-medium text-success">{bestModel}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
