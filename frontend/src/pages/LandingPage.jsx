import React from 'react'
import Navbar from '../components/LandingPageComponents/Navbar'
import HeroSection from '../components/LandingPageComponents/HeroSection'
import HeroSectionTwo from '../components/LandingPageComponents/HeroSectionTwo'
import Footer from '../components/LandingPageComponents/Footer'

const LandingPage = () => {
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