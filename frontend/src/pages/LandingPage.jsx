import React from 'react'
import Navbar from '../components/LandingPageComponents/Navbar'
import HeroSection from '../components/LandingPageComponents/HeroSection'

const LandingPage = () => {
  return (
    <div className='h-screen w-full'>
      <Navbar />
      <HeroSection />
    </div>
  )
}

export default LandingPage