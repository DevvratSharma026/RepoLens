import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../../assets/mainLogo.png"

const Navbar = () => {
    return (
        <div role="navigation" className='fixed top-0 left-0 right-0 z-50 flex flex-row justify-around items-center bg-black/60 backdrop-blur-sm lg:py-4 md:py-2 '>
        {/* section 1 -> logo, name */}
        <div className='flex gap-2'>
            <img className='h-[25px] w-[24px] rounded-xl' src={logo}/>
            <h1 className='lg:text-2xl font-bold bg-linear-to-r from-blue-700 to-violet-400 bg-clip-text text-transparent'>Code Nexus</h1>
        </div>

        {/* section 2 -> nav links */}
        <div className='flex flex-col items-center justify-center cursor-pointer'>
            <ul className='flex gap-16'>
                <Link className='text-gray-500 hover:underline hover:scale-105 hover:text-blue-500 hover:transition' to="/features">Features</Link>
                <Link className='text-gray-500 hover:underline hover:scale-105 hover:text-blue-500 hover:transition' to="/pricing">Pricing</Link>
                <Link className='text-gray-500 hover:underline hover:scale-105 hover:text-blue-500 hover:transition' to="/about">About</Link>
            </ul>
        </div>

        {/* section 3 -> login/signup buttons */}
        <div className='flex gap-3 cursor-pointer'>
            <div className='lg:py-2 lg:px-3 py-1 py-2 lg:text-xl hover:bg-white/10 hover:rounded-md'>
                <Link to="/login">Login</Link>
            </div>
            <div className='py-2 px-3 rounded-md bg-linear-to-r from-violet-600 to-violet-800 '>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    </div>
  )
}

export default Navbar
