import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { PrivateRoute, PublicRoutes } from './Routes/Routes'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import Home from './pages/Home'
import { MainLayout } from './Layout/MainLayout'
import RoadmapPage from './pages/RoadmapPage'
import ModulePage from './pages/ModulePage'

export const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/login' element={<PublicRoutes><Login /></PublicRoutes>} />
        <Route path='/signup' element={<PublicRoutes><Signup /></PublicRoutes>} />

        <Route path='/' element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<Home />} />
          <Route path='home' element={<Home />} />
          <Route path='roadmap' element={<RoadmapPage />} />
          <Route path='moduledetails/:roadmapId/:moduleId' element={<ModulePage />} />
        </Route>

        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </div>
  )
}
