import React from 'react'
import Navbar from '../components/LandingPageComponents/Navbar'
import HeroSection from '../components/LandingPageComponents/HeroSection'
import HeroSectionTwo from '../components/LandingPageComponents/HeroSectionTwo'

const LandingPage = () => {
  return (
    <div className='h-screen w-full'>
      <Navbar />
      <HeroSection />
      <HeroSectionTwo />
    </div>
  )
}

export default LandingPage