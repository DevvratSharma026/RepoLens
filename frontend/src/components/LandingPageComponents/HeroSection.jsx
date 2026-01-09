import React from "react";
import heroImage from "../../assets/HeroImage.png";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

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
}`;

const HeroSection = () => {
  const codeLines = sampleCode.split("\n");

  return (
    <div className="relative w-full min-h-screen flex items-center bg-gray-900">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 flex flex-col gap-12 lg:gap-16">
        {/* Text Section */}
        <div className="max-w-4xl flex flex-col items-start gap-6 animate-fade-in-up">
          <div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight">
              Your AI Code Reviewer.
            </h2>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-500 leading-tight">
              Faster. Smarter.
            </h2>
          </div>

          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Automatically review your code, detect issues, suggest improvements,
            and get better folder structure recommendations — all powered by AI.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Link
              to={"/login"}
              className="group px-8 py-3 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 text-white text-lg font-semibold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center gap-2"
            >
              Get Started Free
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Visuals Section (Code Window + Suggestions) */}
        <div className="flex flex-col xl:flex-row items-start gap-8 w-full">
          {/* Code Window */}
          <div className="w-full max-w-3xl relative bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl shadow-[-4px_-1px_32px_1px_rgba(147,51,234,0.3)] overflow-hidden">
            {/* Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="w-3 h-3 bg-green-400 rounded-full" />
                <span className="ml-3 text-sm text-gray-300 font-medium font-mono">
                  utils.ts
                </span>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto">
              <div className="min-w-[400px]">
                {codeLines.map((line, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 text-sm leading-6"
                  >
                    <div className="w-6 text-right text-gray-600 select-none font-mono text-xs pt-0.5">
                      {i + 1}
                    </div>
                    <div className="text-gray-200 font-mono whitespace-pre-wrap">
                      {line}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Suggestions - Responsive Grid */}
          <div className="w-full xl:w-auto flex flex-col md:flex-row xl:flex-col gap-4">
            {/* Suggestion 1 */}
            <div className="flex-1 xl:w-80 p-4 rounded-xl bg-linear-to-br from-[#2b1250] to-[#39124f] border border-[#5f3ea6] shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm text-purple-200 font-semibold">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-purple-200"
                >
                  <path
                    d="M12 2l2.09 6.26L20 9l-5 3.64L16.18 19 12 15.77 7.82 19 9 12.64 4 9l5.91-.74L12 2z"
                    fill="currentColor"
                  />
                </svg>
                AI Suggestion
              </div>
              <p className="text-gray-200 text-sm mt-2 leading-relaxed">
                Add null check for `data` parameter to prevent runtime errors.
              </p>
            </div>

            {/* Suggestion 2 */}
            <div className="flex-1 xl:w-80 p-4 rounded-xl bg-[#1a1110]/90 border border-[#7a4b1f] shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm text-yellow-300 font-semibold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z"
                    fill="currentColor"
                  />
                </svg>
                Refactor
              </div>
              <p className="text-gray-200 text-sm mt-2 leading-relaxed">
                Extract logging logic into a separate utility function.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
