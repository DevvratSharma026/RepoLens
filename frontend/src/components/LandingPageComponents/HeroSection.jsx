import React from 'react'
import heroImage from "../../assets/HeroImage.png";
import { FaArrowRight } from "react-icons/fa";

const sampleCode = `function processData(data) {
  // AI suggests: Consider adding null check
  const result = data.map(item => {
    return item.value * 2;
  });
  
  // AI: Extract to separate function
  for (let i = 0; i < result.length; i++) {
    console.log(result[i]);
  }
  
  return result;
}`

const HeroSection = () => {
  const codeLines = sampleCode.split('\n');

  return (
    <div className='h-screen w-full'>
      <div className='relative h-screen w-full bg-cover bg-center' style={{ backgroundImage: `url(${heroImage})` }}>

        <div className='absolute inset-0' style={{ backgroundColor: 'rgba(0,0,0,0.65)' }} />

        <div className="absolute top-16 left-12 right-12 z-10 flex flex-col items-start gap-6">
          <div className="max-w-4xl">
            <h2 className="text-7xl font-extrabold">Your AI Code Reviewer.</h2>
            <h2 className="text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-500">Faster. Smarter.</h2>
            <p className='text-gray-300 text-xl mt-3'>Automatically review your code, detect issues, suggest improvements, and get better folder structure recommendations — all powered by AI.</p>

            <div className='mt-6 flex items-center gap-4'>
              <button className="px-8 py-3 bg-linear-to-r from-purple-600 to-purple-500 text-white text-lg font-semibold rounded-lg shadow-lg flex items-center gap-2">Get Started Free <FaArrowRight /></button>
            </div>
          </div>

          <div className='mt-2 flex items-start gap-8 w-full'>
            {/* Code window */}
            <div className='relative bg-opacity-1 border border-gray-800 rounded-xl shadow-[-4px_-1px_32px_1px_rgba(147,51,234,0.5)] p-0 overflow-hidden w-180 '>
              <div className='flex items-center justify-between px-4 py-2 bg-opacity-1 border-b border-gray-800'>
                <div className='flex items-center gap-2'>
                  <span className='w-3 h-3 bg-red-500 rounded-full' />
                  <span className='w-3 h-3 bg-yellow-400 rounded-full' />
                  <span className='w-3 h-3 bg-green-400 rounded-full' />
                  <span className='ml-4 text-sm text-gray-300 font-medium'>utils.ts</span>
                </div>
                <div className='text-xs text-gray-400'> </div>
              </div>

              <div className='flex text-sm'>
                <div className='px-4 py-4'>
                  <div className='max-h-66' style={{ minWidth: 520 }}>
                    {codeLines.map((line, i) => (
                      <div key={i} className='flex items-start gap-4'>
                        <div className='w-8 text-right pr-2 text-gray-500 select-none'>{i + 1}</div>
                        <div className='text-gray-100 font-mono whitespace-pre-wrap'>{line}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className='flex flex-col gap-4 mt-6'>
              <div className='w-80 p-4 rounded-xl bg-linear-to-br from-[#2b1250] to-[#39124f] border border-[#5f3ea6] shadow-md'>
                <div className='flex items-center gap-2 text-sm text-purple-200 font-semibold'>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className='text-purple-200'><path d="M12 2l2.09 6.26L20 9l-5 3.64L16.18 19 12 15.77 7.82 19 9 12.64 4 9l5.91-.74L12 2z" fill="currentColor"/></svg>
                  AI Suggestion
                </div>
                <p className='text-gray-200 text-sm mt-2'>Add null check for `data` parameter to prevent runtime errors.</p>
              </div>

              <div className='w-80 p-4 rounded-xl bg-[#1a1110] border border-[#7a4b1f] shadow-md'>
                <div className='flex items-center gap-2 text-sm text-yellow-300 font-semibold'>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" fill="currentColor"/></svg>
                  Refactor
                </div>
                <p className='text-gray-200 text-sm mt-2'>Extract logging logic into a separate utility function.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default HeroSection