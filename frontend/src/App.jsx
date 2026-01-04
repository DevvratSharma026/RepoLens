import {Route, Routes, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyOtp from './pages/VerifyOtp'
import ProtectedRoute from './routes/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import NewReview from './pages/NewReview'
import ReviewUpload from './pages/ReviewUpload'
import ReviewCreate from './pages/ReviewCreate'
import ReviewStatus from './pages/ReviewStatus'
import ReviewGithub from './pages/ReviewGithub'
import LandingPage from './pages/LandingPage'

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
      <Route path='/review/new' element={
        <ProtectedRoute>
          <NewReview />
        </ProtectedRoute>
      } />

      <Route path='/review/upload' element={
        <ProtectedRoute>
          <ReviewUpload />
        </ProtectedRoute> 
      } />

      <Route path='/review/create/:snapshotId' element={
        <ProtectedRoute>
          <ReviewCreate />
        </ProtectedRoute>
      } />

      <Route path='/review/:reviewId' element={
        <ProtectedRoute>
          <ReviewStatus />
        </ProtectedRoute>
      } />

      <Route path='/review/github' element={
        <ProtectedRoute>
          <ReviewGithub />
        </ProtectedRoute>
      } />

      <Route path='/' element={<LandingPage />} />

      {/* tmp default Route */}
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App
