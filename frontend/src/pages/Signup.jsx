import React, { useState } from 'react';
import { signup } from '../api/auth.api';
import { Link, useNavigate } from 'react-router-dom';

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
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch(err) {
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
    <div className='min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 text-black'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='text-center text-3xl font-extrabold text-gray-900 tracking-tight'>
          Create your account
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Join thousands of teams managing workflow better.
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            
            {/* Name Row */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>First Name</label>
                <input
                  name='firstName'
                  type='text'
                  className='block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm'
                  placeholder='Jane'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>Last Name</label>
                <input
                  name='lastName'
                  type='text'
                  className='block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm'
                  placeholder='Doe'
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>Work Email</label>
              <input
                name='email'
                type='email'
                className='block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm'
                placeholder='jane@company.com'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>Password</label>
              <input
                name='password'
                type='password'
                className='block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm'
                placeholder='••••••••'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>Confirm Password</label>
              <input
                name='confirmPassword'
                type='password'
                className='block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm'
                placeholder='••••••••'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
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
            <p className='text-sm text-gray-500'>
              Already a member <Link className='underline text-blue-700' to="/login">Log in</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;