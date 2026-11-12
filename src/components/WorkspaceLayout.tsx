import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  Image,
  Layers,
  Home as HomeIcon,
  Map,
  BarChart3,
  FileDown,
  Settings,
  Crosshair,
  Scan,
} from 'lucide-react'

const navItems = [
  { path: '/workspace', label: 'Overview', icon: LayoutDashboard, end: true },
  { path: '/workspace/upload', label: 'New Analysis', icon: Upload },
  { path: '/workspace/extraction', label: 'Feature Extraction', icon: Layers },
  { path: '/workspace/roof-classification', label: 'Roof Classification', icon: HomeIcon },
  { path: '/workspace/gis', label: 'GIS Explorer', icon: Map },
  { path: '/workspace/models', label: 'Model Performance', icon: BarChart3 },
]

interface WorkspaceLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function WorkspaceLayout({ children, title, subtitle }: WorkspaceLayoutProps) {
  const location = useLocation()

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sidebar flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <NavLink to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-7 h-7 bg-building flex items-center justify-center">
              <Crosshair size={15} className="text-white" />
            </div>
            <div>
              <div className="text-[0.8125rem] font-semibold tracking-[0.04em] text-terrain-50">
                TERRASCOPE
              </div>
              <div className="text-[0.5625rem] text-terrain-400 tracking-[0.06em] uppercase">
                Geospatial Analysis
              </div>
            </div>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3">
          <div className="px-4 py-2">
            <span className="label-section text-terrain-500">Workspace</span>
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon size={16} strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}

          <div className="px-4 py-2 mt-4">
            <span className="label-section text-terrain-500">System</span>
          </div>
          <NavLink to="/workspace" className="sidebar-link">
            <FileDown size={16} strokeWidth={1.5} />
            Reports & Exports
          </NavLink>
          <NavLink to="/workspace" className="sidebar-link">
            <Settings size={16} strokeWidth={1.5} />
            Settings
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Scan size={14} className="text-terrain-500" />
            <span className="text-[0.6875rem] text-terrain-500 font-mono">
              SVAMITVA Protocol v1.0
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-boundary bg-white">
          <div>
            <h1 className="text-[1.0625rem] font-semibold text-text m-0">{title}</h1>
            {subtitle && (
              <p className="text-[0.75rem] text-text-muted mt-0.5 m-0">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="label-technical">
              {new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <div className="w-7 h-7 bg-terrain-200 flex items-center justify-center text-[0.6875rem] font-semibold text-terrain-700">
              TS
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
