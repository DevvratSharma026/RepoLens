import {Route, Routes, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOtp from './pages/VerifyOtp'
import ProtectedRoute from './routes/ProtectedRoute'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/verify-otp' element={<VerifyOtp />} />
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* tmp default Route */}
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App
