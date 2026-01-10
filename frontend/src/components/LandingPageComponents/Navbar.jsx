import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from "../../assets/mainLogo.png"

const Navbar = () => {
    const [open, setOpen] = useState(false)

    return (
        <div role="navigation" className='fixed top-0 left-0 right-0 z-50 flex flex-row justify-between items-center px-4 lg:px-12 bg-black/60 backdrop-blur-sm lg:py-4 md:py-2'>
        {/* section 1 -> logo, name */}
        <div className='flex items-center gap-3'>
            <img className='h-[25px] w-[24px] rounded-xl' src={logo} alt="Repo Lens"/>
            <h1 className='lg:text-2xl font-bold bg-linear-to-r from-blue-700 to-violet-400 bg-clip-text text-transparent'>Repo Lens</h1>
        </div>

        {/* Desktop nav: shown only on large screens */}
        <div className='hidden lg:flex flex-1 justify-center items-center'>
            <ul className='flex gap-16'>
                <Link className='text-gray-500 hover:underline hover:scale-105 hover:text-blue-500 hover:transition' to="/features">Features</Link>
                <Link className='text-gray-500 hover:underline hover:scale-105 hover:text-blue-500 hover:transition' to="/pricing">Pricing</Link>
                <Link className='text-gray-500 hover:underline hover:scale-105 hover:text-blue-500 hover:transition' to="/about">About</Link>
            </ul>
        </div>

        {/* Desktop auth: shown only on large screens */}
        <div className='hidden lg:flex items-center gap-3'>
            <div className='lg:py-2 lg:px-3 py-1 lg:text-xl hover:bg-white/10 hover:rounded-md'>
                <Link to="/login">Login</Link>
            </div>
            <div className='py-2 px-3 rounded-md bg-linear-to-r from-violet-600 to-violet-800'>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>

        {/* Mobile hamburger: visible on screens smaller than lg (includes md) */}
        <div className='lg:hidden'>
            <button aria-label='Toggle menu' onClick={()=>setOpen(v=>!v)} className='p-2 rounded-md hover:bg-white/10'>
                {open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                    </svg>
                )}
            </button>

            {/* Mobile dropdown/menu - shown when `open` is true */}
            {open && (
                <div className='absolute right-4 top-full mt-3 w-64 bg-black/80 backdrop-blur-md rounded-md p-4 flex flex-col gap-3 lg:hidden'>
                    <Link onClick={()=>setOpen(false)} className='text-gray-300 hover:text-white' to="/features">Features</Link>
                    <Link onClick={()=>setOpen(false)} className='text-gray-300 hover:text-white' to="/pricing">Pricing</Link>
                    <Link onClick={()=>setOpen(false)} className='text-gray-300 hover:text-white' to="/about">About</Link>
                    <div className='h-[1px] bg-white/10 my-2'/>
                    <Link onClick={()=>setOpen(false)} className='py-2 text-center rounded-md hover:bg-white/10' to="/login">Login</Link>
                    <Link onClick={()=>setOpen(false)} className='py-2 text-center rounded-md bg-linear-to-r from-violet-600 to-violet-800' to="/signup">Sign Up</Link>
                </div>
            )}
        </div>
    </div>
  )
}

export default Navbar
