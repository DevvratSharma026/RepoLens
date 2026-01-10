import React from 'react'
import { FaAlignRight, FaArrowRight } from 'react-icons/fa'

import { Link } from 'react-router-dom';

const FooterSectionOne = () => {
  return (
    <div>
        <div 
        className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-400 h-75 opacity-30 blur-[100px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(30, 58, 138, 0) 100%)'
        }}
      />

      <div className='relative z-10 flex flex-col items-center justify-center px-4 text-center'>
        <h2 className='text-4xl md:text-6xl font-bold tracking-tight'>
          Ready to write <span className='text-purple-400'>better code</span>?
        </h2>

        <p className='mt-6 text-lg md:text-xl text-gray-400 max-w-2xl'>
          Join thousands of developers who use Repo Lens to ship faster with confidence.
        </p>

        <div className='mt-10'>
          <Link 
            to='/login' 
            className="group px-8 py-4 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 text-white text-lg font-semibold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center gap-2"
          >
            Start Your Free Trial 
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FooterSectionOne