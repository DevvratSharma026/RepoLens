import React, { useEffect } from 'react'
import Navbar from '../components/LandingPageComponents/Navbar'
import HeroSection from '../components/LandingPageComponents/HeroSection'
import HeroSectionTwo from '../components/LandingPageComponents/HeroSectionTwo'
import Footer from '../components/LandingPageComponents/Footer'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className='h-screen w-full'>
      <Navbar />
      <HeroSection />
      <HeroSectionTwo />
      <Footer />
    </div>
  )
}

export default LandingPage