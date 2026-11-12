import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload,
  FileImage,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Play,
  Globe,
  Ruler,
  Grid3x3,
  Layers,
  MapPin,
} from 'lucide-react'
import WorkspaceLayout from '../components/WorkspaceLayout'

interface UploadedFile {
  file: File
  preview: string
  metadata: {
    width: number
    height: number
    size: string
    format: string
  }
}

export default function UploadPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [uploading, setUploading] = useState(false)
  const [analysisConfig, setAnalysisConfig] = useState({
    model: 'unet',
    buildings: true,
    roads: true,
    water: true,
    vegetation: true,
    boundaries: true,
    confidenceThreshold: 0.5,
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFile = useCallback((file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/tiff']
    const validExts = ['.jpg', '.jpeg', '.png', '.tif', '.tiff']
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

    if (!validExts.includes(ext)) {
      alert('Unsupported format. Please upload JPG, PNG or GeoTIFF files.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setUploadedFile({
          file,
          preview: e.target?.result as string,
          metadata: {
            width: img.width,
            height: img.height,
            size: formatFileSize(file.size),
            format: ext.replace('.', '').toUpperCase(),
          },
        })
      }
      img.onerror = () => {
        // For TIFF files that can't render in browser
        setUploadedFile({
          file,
          preview: '',
          metadata: {
            width: 0,
            height: 0,
            size: formatFileSize(file.size),
            format: ext.replace('.', '').toUpperCase(),
          },
        })
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleRunExtraction = () => {
    setUploading(true)
    // Navigate to extraction results after short delay
    setTimeout(() => {
      navigate('/workspace/extraction')
    }, 800)
  }

  const useSampleData = () => {
    // Create a mock uploaded file using the hero image
    setUploadedFile({
      file: new File([], 'sample_village_orthophoto.jpg'),
      preview: '/hero-orthophoto.jpg',
      metadata: {
        width: 4096,
        height: 2731,
        size: '12.4 MB',
        format: 'JPEG',
      },
    })
  }

  return (
    <WorkspaceLayout title="New Analysis" subtitle="Upload and configure orthophoto for feature extraction">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload Zone */}
        <div className="lg:col-span-2">
          {!uploadedFile ? (
            <div
              className={`upload-zone p-12 text-center ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.tif,.tiff"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <Upload size={32} className="text-terrain-400 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-[1rem] font-semibold text-text m-0 mb-2">
                Drop orthophoto here
              </h3>
              <p className="text-[0.8125rem] text-text-muted m-0 mb-4">
                or click to browse files
              </p>
              <div className="flex items-center justify-center gap-4">
                {['JPG', 'PNG', 'GeoTIFF'].map((fmt) => (
                  <span key={fmt} className="font-mono text-[0.6875rem] text-terrain-500 px-2 py-1 bg-surface-alt border border-boundary">
                    {fmt}
                  </span>
                ))}
              </div>
              <p className="text-[0.6875rem] text-text-muted mt-4 m-0">
                Maximum file size: 500 MB
              </p>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              {/* Image preview */}
              <div className="relative bg-terrain-900">
                {uploadedFile.preview ? (
                  <img
                    src={uploadedFile.preview}
                    alt="Uploaded orthophoto"
                    className="w-full h-auto max-h-[400px] object-contain block mx-auto"
                  />
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <FileImage size={40} className="text-terrain-500 mx-auto mb-2" />
                      <span className="text-[0.8125rem] text-terrain-400">
                        TIFF preview not available in browser
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setUploadedFile(null)}
                  className="absolute top-3 right-3 w-7 h-7 bg-black/50 border-none flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>

              {/* Metadata */}
              <div className="p-4 border-t border-boundary">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={14} className="text-success" />
                  <span className="text-[0.8125rem] font-medium text-text">
                    Image loaded successfully
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="label-technical mb-1">Filename</div>
                    <div className="text-[0.8125rem] text-text font-mono truncate">
                      {uploadedFile.file.name}
                    </div>
                  </div>
                  <div>
                    <div className="label-technical mb-1">Dimensions</div>
                    <div className="text-[0.8125rem] text-text font-mono">
                      {uploadedFile.metadata.width > 0
                        ? `${uploadedFile.metadata.width} × ${uploadedFile.metadata.height}`
                        : 'Inspect via backend'}
                    </div>
                  </div>
                  <div>
                    <div className="label-technical mb-1">File Size</div>
                    <div className="text-[0.8125rem] text-text font-mono">
                      {uploadedFile.metadata.size}
                    </div>
                  </div>
                  <div>
                    <div className="label-technical mb-1">Format</div>
                    <div className="text-[0.8125rem] text-text font-mono">
                      {uploadedFile.metadata.format}
                    </div>
                  </div>
                </div>

                {/* GeoTIFF specific info */}
                {(uploadedFile.metadata.format === 'TIF' || uploadedFile.metadata.format === 'TIFF') ? (
                  <div className="mt-4 p-3 bg-surface border border-boundary">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe size={13} className="text-water" />
                      <span className="label-technical text-water-dark">GeoTIFF Metadata</span>
                    </div>
                    <p className="text-[0.75rem] text-text-muted m-0">
                      Full geospatial metadata (CRS, bounds, transform, pixel resolution)
                      will be extracted by the backend processing engine using Rasterio.
                    </p>
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {[
                        { icon: Globe, label: 'CRS', value: 'Pending extraction' },
                        { icon: Ruler, label: 'Resolution', value: 'Pending extraction' },
                        { icon: MapPin, label: 'Bounds', value: 'Pending extraction' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <item.icon size={12} className="text-terrain-400" />
                          <div>
                            <div className="text-[0.5625rem] text-text-muted uppercase">{item.label}</div>
                            <div className="text-[0.6875rem] text-text-muted font-mono">{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-surface border border-boundary flex items-start gap-2">
                    <Info size={13} className="text-text-muted mt-0.5 shrink-0" />
                    <p className="text-[0.75rem] text-text-muted m-0">
                      This is a standard {uploadedFile.metadata.format} file. Geographic reference
                      metadata (CRS, bounds) is not embedded. For georeferenced analysis,
                      upload a GeoTIFF file.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sample data button */}
          {!uploadedFile && (
            <div className="mt-4 flex items-center gap-2">
              <button onClick={useSampleData} className="btn-secondary text-[0.75rem]">
                <FileImage size={14} />
                Use Sample Orthophoto
              </button>
              <span className="text-[0.6875rem] text-text-muted">
                Test the platform without uploading your own data
              </span>
            </div>
          )}
        </div>

        {/* Right: Configuration */}
        <div className="flex flex-col gap-4">
          {/* Model Selection */}
          <div className="card p-4">
            <div className="label-section mb-3">Segmentation Model</div>
            {[
              { id: 'unet', name: 'U-Net', desc: 'Baseline encoder-decoder', params: '31.0M' },
              { id: 'deeplabv3plus', name: 'DeepLabV3+', desc: 'Atrous pyramid pooling', params: '59.3M' },
              { id: 'segformer', name: 'SegFormer', desc: 'Transformer-based', params: '84.7M' },
            ].map((model) => (
              <label
                key={model.id}
                className={`flex items-start gap-3 p-3 border cursor-pointer mb-2 transition-colors ${
                  analysisConfig.model === model.id
                    ? 'border-building bg-building/5'
                    : 'border-boundary hover:border-terrain-400'
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  checked={analysisConfig.model === model.id}
                  onChange={() => setAnalysisConfig((c) => ({ ...c, model: model.id }))}
                  className="mt-0.5"
                />
                <div>
                  <div className="text-[0.8125rem] font-semibold text-text">{model.name}</div>
                  <div className="text-[0.6875rem] text-text-muted">{model.desc}</div>
                  <div className="font-mono text-[0.625rem] text-terrain-500 mt-1">{model.params} params</div>
                </div>
              </label>
            ))}
          </div>

          {/* Feature Categories */}
          <div className="card p-4">
            <div className="label-section mb-3">Extraction Categories</div>
            {[
              { key: 'buildings', label: 'Buildings', color: '#D66B45' },
              { key: 'roads', label: 'Roads', color: '#D8AC4B' },
              { key: 'water', label: 'Water Bodies', color: '#4B9EAA' },
              { key: 'vegetation', label: 'Vegetation', color: '#82966B' },
              { key: 'boundaries', label: 'Boundaries', color: '#5A5C52' },
            ].map((cat) => (
              <label
                key={cat.key}
                className="flex items-center gap-3 py-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={analysisConfig[cat.key as keyof typeof analysisConfig] as boolean}
                  onChange={(e) =>
                    setAnalysisConfig((c) => ({ ...c, [cat.key]: e.target.checked }))
                  }
                />
                <div
                  className="w-2.5 h-2.5"
                  style={{ background: cat.color }}
                />
                <span className="text-[0.8125rem] text-text">{cat.label}</span>
              </label>
            ))}
          </div>

          {/* Confidence Threshold */}
          <div className="card p-4">
            <div className="label-section mb-3">Confidence Threshold</div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.1}
                max={0.95}
                step={0.05}
                value={analysisConfig.confidenceThreshold}
                onChange={(e) =>
                  setAnalysisConfig((c) => ({
                    ...c,
                    confidenceThreshold: parseFloat(e.target.value),
                  }))
                }
                className="flex-1"
              />
              <span className="font-mono text-[0.8125rem] text-text w-10 text-right">
                {analysisConfig.confidenceThreshold.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={handleRunExtraction}
            disabled={!uploadedFile || uploading}
            className="btn-primary w-full justify-center py-3 text-[0.875rem] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>Processing...</>
            ) : (
              <>
                <Play size={16} />
                Run Feature Extraction
              </>
            )}
          </button>
        </div>
      </div>
    </WorkspaceLayout>
  )
}
