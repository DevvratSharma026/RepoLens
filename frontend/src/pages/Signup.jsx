import React, { useState } from 'react';
import { signup } from '../api/auth.api';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/loginVideo.mp4';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    setError(null);

    try {
      const response = await signup(formData);
      if(response.success) {
        navigate('/verify-otp', { state: { email: formData.email } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    /* Added 'relative' and 'overflow-hidden' to keep video contained */
    <div className='relative min-h-screen flex flex-col justify-center py-12 px-6 lg:px-8 overflow-hidden'>
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hidden lg:absolute lg:block inset-0 w-full h-full object-cover z-0"
      >
        <source src={backgroundImage} type="video/mp4" />
      </video>

      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Header - Added 'relative z-20' */}
      <div className='relative z-20 sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='text-center text-3xl font-extrabold text-white tracking-tight'>
          Create your account
        </h2>
        <p className='mt-2 text-center text-sm text-gray-300'>
          Join thousands of teams managing workflow better.
        </p>
      </div>

      {/* Form Container - Added 'relative z-20' */}
      <div className='relative z-20 mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='py-8 px-10 rounded-2xl border shadow-white shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border-gray-100'>
          <form onSubmit={handleSubmit} className='space-y-5'>

            {/* Name Row */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1'>First Name</label>
                <input
                  name='firstName'
                  type='text'
                  /* Added 'bg-white/10' and 'placeholder:text-gray-300' for better UI */
                  className='block w-full px-3 py-2.5 bg-white/10 border border-gray-300 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400'
                  placeholder='Jane'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1'>Last Name</label>
                <input
                  name='lastName'
                  type='text'
                  className='block w-full px-3 py-2.5 bg-white/10 border border-gray-300 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400'
                  placeholder='Doe'
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='block text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1'>Work Email</label>
              <input
                name='email'
                type='email'
                className='block w-full px-3 py-2.5 bg-white/10 border border-gray-300 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400'
                placeholder='jane@company.com'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className='block text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1'>Password</label>
              <input
                name='password'
                type='password'
                className='block w-full px-3 py-2.5 bg-white/10 border border-gray-300 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400'
                placeholder='••••••••'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className='block text-xs font-semibold text-gray-200 uppercase tracking-wider mb-1'>Confirm Password</label>
              <input
                name='confirmPassword'
                type='password'
                className='block w-full px-3 py-2.5 bg-white/10 border border-gray-300 rounded-lg text-white text-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400'
                placeholder='••••••••'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm border border-red-500/50">
                {error}
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50'
            >
              {loading ? 'Creating account...' : 'Get Started'}
            </button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-300'>
              Already a member? <Link className='underline text-indigo-400 font-medium' to="/login">Log in</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
