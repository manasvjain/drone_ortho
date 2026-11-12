import { useNavigate } from 'react-router-dom'
import {
  Crosshair,
  ArrowRight,
  Layers,
  Map,
  Scan,
  FileDown,
  ChevronRight,
  Building2,
  Route,
  Droplets,
  TreePine,
  Grid3x3,
  Cpu,
  ImageIcon,
  Database,
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface">
      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-boundary">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-nav flex items-center justify-center">
              <Crosshair size={14} className="text-white" />
            </div>
            <span className="text-[0.875rem] font-semibold tracking-[0.04em] text-text">
              TERRASCOPE
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Overview', 'Methodology', 'Capabilities'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[0.8125rem] text-text-muted hover:text-text transition-colors no-underline"
              >
                {item}
              </a>
            ))}
          </nav>

          <button
            onClick={() => navigate('/workspace')}
            className="btn-primary text-[0.75rem]"
          >
            Launch Workspace
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="pt-14">
        <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-12">
          {/* Technical label */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-1.5 bg-building rounded-full" />
            <span className="label-technical">
              AI-Powered Geospatial Analysis Platform
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left — Text */}
            <div>
              <h1 className="font-display text-[2.75rem] leading-[1.1] font-semibold text-text m-0 mb-5">
                From aerial pixels
                <br />
                to ground intelligence.
              </h1>
              <p className="text-[1rem] leading-[1.65] text-text-muted max-w-[480px] m-0 mb-8">
                An intelligent geospatial analysis platform for automated feature
                extraction from drone orthophotos. Built for the SVAMITVA initiative
                — transforming rural India's land-record infrastructure through
                precision mapping.
              </p>

              <div className="flex items-center gap-3 mb-10">
                <button
                  onClick={() => navigate('/workspace')}
                  className="btn-primary"
                >
                  Launch Workspace
                  <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => navigate('/workspace/upload')}
                  className="btn-secondary"
                >
                  Upload Orthophoto
                </button>
              </div>

              {/* Technical spec card */}
              <div className="card p-4 max-w-[420px]">
                <div className="label-section mb-3">Platform Specifications</div>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-6">
                  {[
                    ['Analysis Engine', 'U-Net / DeepLabV3+ / SegFormer'],
                    ['Input Formats', 'JPG, PNG, GeoTIFF'],
                    ['Extraction', 'Buildings, Roads, Water, Vegetation'],
                    ['GIS Export', 'GeoJSON, Shapefile, CRS Support'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="text-[0.625rem] font-medium text-text-muted uppercase tracking-wider">
                        {label}
                      </div>
                      <div className="text-[0.75rem] text-text mt-0.5 font-mono">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="relative">
              <div className="border border-boundary bg-white p-1.5">
                <img
                  src="/hero-orthophoto.jpg"
                  alt="Drone orthophoto of rural Indian village"
                  className="w-full h-auto block"
                />
                {/* Overlay annotations */}
                <div className="absolute top-6 right-6 bg-nav/90 backdrop-blur-sm text-terrain-50 px-3 py-2 text-[0.6875rem] font-mono">
                  <div className="text-[0.5625rem] text-terrain-400 uppercase tracking-wider mb-1">
                    Sample Orthophoto
                  </div>
                  27.1751° N, 78.0421° E
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <span className="label-technical">Drone Capture · 4.2cm/px GSD</span>
                <span className="label-technical">EPSG:4326</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== METHODOLOGY ===== */}
      <section id="methodology" className="py-16 border-t border-boundary">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 bg-water rounded-full" />
            <span className="label-technical">Processing Pipeline</span>
          </div>
          <h2 className="font-display text-[1.75rem] font-semibold text-text m-0 mb-10">
            Methodology
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {[
              {
                step: '01',
                title: 'Ingest',
                desc: 'Upload drone orthophotos with automatic CRS detection and metadata extraction.',
                icon: ImageIcon,
              },
              {
                step: '02',
                title: 'Segment',
                desc: 'Pixel-level semantic segmentation using U-Net, DeepLabV3+ or SegFormer architectures.',
                icon: Cpu,
              },
              {
                step: '03',
                title: 'Extract',
                desc: 'Convert segmentation masks to vector polygons with area, perimeter and centroid computations.',
                icon: Layers,
              },
              {
                step: '04',
                title: 'Export',
                desc: 'Generate GeoJSON, Shapefiles and structured reports with CRS-aware coordinates.',
                icon: FileDown,
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="relative p-5 border border-boundary bg-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[0.6875rem] text-text-muted">
                    {item.step}
                  </span>
                  <item.icon size={18} className="text-terrain-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-[0.9375rem] font-semibold text-text m-0 mb-2">
                  {item.title}
                </h3>
                <p className="text-[0.8125rem] leading-[1.5] text-text-muted m-0">
                  {item.desc}
                </p>
                {i < 3 && (
                  <ChevronRight
                    size={16}
                    className="absolute right-[-9px] top-1/2 -translate-y-1/2 text-terrain-400 bg-surface z-10 hidden md:block"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAPABILITIES ===== */}
      <section id="capabilities" className="py-16 border-t border-boundary">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 bg-vegetation rounded-full" />
            <span className="label-technical">Extraction Categories</span>
          </div>
          <h2 className="font-display text-[1.75rem] font-semibold text-text m-0 mb-10">
            Capabilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                label: 'Buildings',
                value: 'Footprint polygons, roof classification, area measurement',
                color: 'bg-building',
                icon: Building2,
              },
              {
                label: 'Roads',
                value: 'Network extraction, width estimation, connectivity analysis',
                color: 'bg-road',
                icon: Route,
              },
              {
                label: 'Water Bodies',
                value: 'Pond/canal/drain detection, surface area computation',
                color: 'bg-water',
                icon: Droplets,
              },
              {
                label: 'Vegetation',
                value: 'Tree clusters, cropland, grass coverage estimation',
                color: 'bg-vegetation',
                icon: TreePine,
              },
              {
                label: 'Boundaries',
                value: 'Plot boundary detection, parcel delineation',
                color: 'bg-terrain-700',
                icon: Grid3x3,
              },
            ].map((cap) => (
              <div key={cap.label} className="card p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 ${cap.color}`} />
                  <span className="text-[0.8125rem] font-semibold text-text">
                    {cap.label}
                  </span>
                </div>
                <p className="text-[0.75rem] leading-[1.5] text-text-muted m-0 flex-1">
                  {cap.value}
                </p>
                <cap.icon
                  size={24}
                  className="text-terrain-300 mt-3 self-end"
                  strokeWidth={1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SVAMITVA CONTEXT ===== */}
      <section id="overview" className="py-16 border-t border-boundary bg-white">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 bg-road rounded-full" />
                <span className="label-technical">Initiative Context</span>
              </div>
              <h2 className="font-display text-[1.75rem] font-semibold text-text m-0 mb-4">
                SVAMITVA Initiative
              </h2>
              <p className="text-[0.9375rem] leading-[1.7] text-text-muted m-0 mb-4">
                Survey of Villages and Mapping with Improvised Technology in Village
                Areas — a Government of India scheme to provide rural property owners
                with legal documentation of residential property through drone-based
                surveying.
              </p>
              <p className="text-[0.9375rem] leading-[1.7] text-text-muted m-0">
                TERRASCOPE automates the feature extraction pipeline that currently
                requires manual digitisation, reducing processing time from weeks to
                hours while maintaining survey-grade accuracy.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '6.62L', label: 'Villages Targeted' },
                { value: '≈100M', label: 'Property Cards Goal' },
                { value: '4.2cm', label: 'GSD Resolution' },
                { value: '≤5cm', label: 'Positional Accuracy' },
              ].map((stat) => (
                <div key={stat.label} className="card-inset p-5 flex flex-col justify-center">
                  <div className="stat-value mb-1">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-boundary py-8 bg-surface">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-nav flex items-center justify-center">
              <Crosshair size={10} className="text-white" />
            </div>
            <span className="text-[0.75rem] font-semibold tracking-[0.04em] text-text">
              TERRASCOPE
            </span>
            <span className="text-[0.6875rem] text-text-muted ml-2">
              Major Year Academic Project · 2024–25
            </span>
          </div>
          <span className="label-technical">
            AI-Powered Feature Extraction for SVAMITVA
          </span>
        </div>
      </footer>
    </div>
  )
}
