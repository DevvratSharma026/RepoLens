import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex flex-row justify-around items-center bg-black/10 py-4 '>
        {/* section 1 -> logo, name */}
        <div>
            <h1 className='text-2xl font-bold bg-linear-to-r from-blue-700 to-violet-400 bg-clip-text text-transparent'>Code Nexus</h1>
        </div>

        {/* section 2 -> nav links */}
        <div className='flex flex-col items-center justify-center'>
            <ul className='flex gap-16'>
                <Link className='text-gray-500 hover:underline hover:scale-105 hover:text-blue-500 hover:transition' to="/features">Features</Link>
                <Link className='text-gray-500 hover:underline hover:scale-105 hover:text-blue-500 hover:transition' to="/pricing">Pricing</Link>
                <Link className='text-gray-500 hover:underline hover:scale-105 hover:text-blue-500 hover:transition' to="/about">About</Link>
            </ul>
        </div>

        {/* section 3 -> login/signup buttons */}
        <div className='flex gap-3'>
            <div className=' py-2 px-3 hover:bg-white/10 hover:rounded-md'>
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
