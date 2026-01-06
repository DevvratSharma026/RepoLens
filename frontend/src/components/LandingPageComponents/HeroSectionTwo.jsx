import React from 'react'
import starImg from '../../assets/star.png'
import codeImg from '../../assets/code.png'
import diagramImg from '../../assets/diagram.png'
import githubImg from '../../assets/github.png'
import lightingImg from '../../assets/lighting.png'
import shieldImg from '../../assets/shield.png'

const HeroSectionTwo = () => {

    const features = [
        {
            image: starImg,
            title: "AI-Powered Analysis",
            description: "Deep code analysis using advanced AI algorithms to identify potential issues and improvements."
        },
        {
            image: codeImg,
            title: "Smart Suggestions",
            description: "get contextual recommendations for better code patterns, performance optimizations, and best practices."
        },
        {
            image: diagramImg,
            title: "Structure Recommendations",
            description: "Recive intelligent suggestions for better project organization and folder structures to enhance maintainability."
        },
        {
            image: githubImg,
            title: "GitHub Integration",
            description: "Seamlessly connect with your GitHub repositories for automatic pull request reviews."
        },
        {
            image: lightingImg,
            title: "Lightning Fast",
            description: "Get instant feedback on your code with our optimized analysis pipeline."
        },
        {
            image: shieldImg,
            title: "Security First",
            description: "Identify potential security vulnerabilities before they reach production."
        },

    ]

    return (
        <div className='h-screen w-full relative flex flex-col items-center'>
            <div className='w-[55%] mt-14 m-auto'>
                <h1 className='text-5xl font-bold w-full'>Everything you need for
                    <span className='bg-linear-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text'> better code</span>
                </h1>

                <div className='w-[65%] m-auto'>
                    <p className='text-gray-500 mt-5 text-center'>Powerful features designed to help you write cleaner, more maintainable code with confidence.</p>
                </div>
            </div>

            <div className='h-screen w-full p-10 flex flex-wrap gap-6 justify-center items-center overflow-y-auto'>
                {features.map((feature, index) => (
                    <div key={index} className='border-[0.1px] border-gray-400 rounded-2xl w-[30%] h-[40%] px-8 py-6 bg-gray-950 hover:scale-105 hover:shadow-[0px_4px_28px_0px_rgba(147,51,234,0.5)] transition-transform duration-300 flex flex-col items-start hover:border-purple-400 hover:bg-linear-to-r hover:from-gray-900/90 hover:to-gray-950'>
                        <div className='bg-purple-950 rounded-2xl h-[28%] w-[18%] flex items-center justify-center p-1'>
                            <img src={feature.image} alt={feature.title} className='max-w-full max-h-full object-contain '/>
                        </div>

                        <div className='flex mt-1'>
                            <h2 className='font-semibold text-xl'>{feature.title}</h2>
                        </div>

                        <div>
                            <p className='text-gray-500 mt-4'>{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HeroSectionTwo