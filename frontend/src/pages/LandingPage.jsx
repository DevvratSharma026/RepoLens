import React, { useEffect } from 'react'
import Navbar from '../components/LandingPageComponents/Navbar'
import HeroSection from '../components/LandingPageComponents/HeroSection'
import HeroSectionTwo from '../components/LandingPageComponents/HeroSectionTwo'
import Footer from '../components/LandingPageComponents/Footer'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../api/auth.api'

const LandingPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        if(response.token) {
          navigate('/dashboard');
        }
      } catch(err) {

      }
    }
  })

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