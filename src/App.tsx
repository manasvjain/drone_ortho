import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import UploadPage from './pages/UploadPage'
import FeatureExtraction from './pages/FeatureExtraction'
import RoofClassification from './pages/RoofClassification'
import GISExplorer from './pages/GISExplorer'
import ModelPerformance from './pages/ModelPerformance'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/workspace" element={<Dashboard />} />
      <Route path="/workspace/upload" element={<UploadPage />} />
      <Route path="/workspace/extraction" element={<FeatureExtraction />} />
      <Route path="/workspace/roof-classification" element={<RoofClassification />} />
      <Route path="/workspace/gis" element={<GISExplorer />} />
      <Route path="/workspace/models" element={<ModelPerformance />} />
    </Routes>
  )
}

export default App
