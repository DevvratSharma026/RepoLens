import {Route, Routes, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOtp from './pages/VerifyOtp'

function App() {

  return (
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/verify-otp' element={<VerifyOtp />} />

      {/* tmp default Route */}
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App
