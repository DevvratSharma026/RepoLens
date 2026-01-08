import React, { useEffect, useState } from 'react'
import { verifyOtp } from '../api/auth.api'
import { useLocation, useNavigate } from 'react-router-dom';
import otpVideo from '../assets/otpVideo.mp4'

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await verifyOtp({ email, code });
      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={otpVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-20">
        {/* Verification Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
          <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-200">Check your email</h2>
        <p className="mt-2 text-sm text-gray-100">
          We sent a verification code to <br />
          <span className="font-semibold text-white">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-20">
        <div className="shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100 py-8 px-4 rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 text-center mb-4">
                Enter 6-digit security code
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                className="block w-full text-center tracking-[1em] text-2xl font-mono px-3 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all text-blue-300"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                required
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700 text-center font-medium">{error}</div>
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700 text-center font-medium">
                  ✓ Verified! Redirecting to login...
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Didn't receive the code?{' '}
              <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500 underline decoration-2 underline-offset-4">
                Resend code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp;