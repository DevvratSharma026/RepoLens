import React from "react";
import starImg from "../../assets/star.png";
import codeImg from "../../assets/code.png";
import diagramImg from "../../assets/diagram.png";
import githubImg from "../../assets/github.png";
import lightingImg from "../../assets/lighting.png";
import shieldImg from "../../assets/shield.png";

const HeroSectionTwo = () => {
  const features = [
    {
      image: starImg,
      title: "AI-Powered Analysis",
      description:
        "Deep code analysis using advanced AI algorithms to identify potential issues and improvements.",
    },
    {
      image: codeImg,
      title: "Smart Suggestions",
      description:
        "Get contextual recommendations for better code patterns, performance optimizations, and best practices.",
    },
    {
      image: diagramImg,
      title: "Structure Recommendations",
      description:
        "Receive intelligent suggestions for better project organization and folder structures to enhance maintainability.",
    },
    {
      image: githubImg,
      title: "GitHub Integration",
      description:
        "Seamlessly connect with your GitHub repositories for automatic pull request reviews.",
    },
    {
      image: lightingImg,
      title: "Lightning Fast",
      description:
        "Get instant feedback on your code with our optimized analysis pipeline.",
    },
    {
      image: shieldImg,
      title: "Security First",
      description:
        "Identify potential security vulnerabilities before they reach production.",
    },
  ];

  return (
    <div className="w-full min-h-screen py-20 px-6 flex flex-col items-center bg-gray-950/30">
      <div className="max-w-4xl w-full text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
          Everything you need for{" "}
          <span className="bg-linear-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
            better code
          </span>
        </h1>
        <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
          Powerful features designed to help you write cleaner, more
          maintainable code with confidence.
        </p>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative border border-gray-800 rounded-2xl p-8 bg-gray-950 hover:bg-gray-900/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(147,51,234,0.3)]"
          >
            <div className="w-14 h-14 bg-purple-900/30 rounded-xl flex items-center justify-center p-3 mb-6 group-hover:bg-purple-900/50 transition-colors">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors">
              {feature.title}
            </h3>

            <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSectionTwo;
