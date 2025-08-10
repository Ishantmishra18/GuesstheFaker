import React from 'react';
import { FaGithub, FaStar, FaCodeBranch, FaHeart, FaTwitter, FaDiscord } from 'react-icons/fa';
import { SiBuymeacoffee } from 'react-icons/si';

const Contribute = ({ close }) => {
  return (
         <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br overflow-y-scroll from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button 
          onClick={() => close(false)}
          className="absolute top-4 right-4 text-2xl text-yellow-400 hover:text-white transition-colors p-2 z-50 cursor-pointer"
          aria-label="Close contribute modal"
        >
          ✕
        </button>
        
        {/* Scrollable content */}
        <div className="h-full p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Contribute to Guess the Faker
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Love the game? Help us make it even better! Here's how you can contribute.
            </p>
          </div>

          {/* GitHub Card */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-5 md:p-6 mb-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="flex items-center mb-3 md:mb-4">
              <FaGithub className="text-3xl md:text-4xl mr-3 text-purple-400" />
              <h2 className="text-xl md:text-2xl font-bold">GitHub Repository</h2>
            </div>
            
            <div className="mb-4 md:mb-6">
              <p className="text-gray-300 mb-3 md:mb-4">
                Guess the Faker is open-source under MIT License. Feel free to fork, star, or contribute to the project!
              </p>
              
              <a 
                href="https://github.com/Ishantmishra18/GuesstheFaker" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                <FaCodeBranch className="mr-2" />
                View on GitHub
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-gray-900/50 p-3 md:p-4 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-2" />
                  <span className="font-semibold text-sm md:text-base">Give us a Star</span>
                </div>
                <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
                  Stars help the project gain visibility!
                </p>
              </div>

              <div className="bg-gray-900/50 p-3 md:p-4 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <FaCodeBranch className="text-blue-400 mr-2" />
                  <span className="font-semibold text-sm md:text-base">Fork & Contribute</span>
                </div>
                <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
                  Found a bug? Fork the repo and submit a PR!
                </p>
              </div>

              <div className="bg-gray-900/50 p-3 md:p-4 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <FaHeart className="text-red-400 mr-2" />
                  <span className="font-semibold text-sm md:text-base">Spread the Word</span>
                </div>
                <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
                  Share with friends who might enjoy the game!
                </p>
              </div>
            </div>
          </div>

          {/* Contribution Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {/* Issues */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-gray-700">
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-blue-400">Report Issues</h3>
              <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                Found a bug or have a suggestion? Open an issue on GitHub.
              </p>
              <a 
                href="https://github.com/Ishantmishra18/GuesstheFaker/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-3 md:px-4 py-1 md:py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-xs md:text-sm font-medium transition-colors"
              >
                View Issues
              </a>
            </div>

            {/* Feature Requests */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-gray-700">
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-purple-400">Feature Requests</h3>
              <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base">
                Have an idea to make the game better? We'd love to hear it!
              </p>
              <a 
                href="https://github.com/Ishantmishra18/GuesstheFaker/discussions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-3 md:px-4 py-1 md:py-2 bg-purple-600 hover:bg-purple-500 rounded-md text-xs md:text-sm font-medium transition-colors"
              >
                Join Discussions
              </a>
            </div>
          </div>


          {/* License Info */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-green-400">MIT License</h2>
            <div className="bg-gray-900/50 p-3 md:p-4 rounded-lg mb-3 md:mb-4 overflow-x-auto">
              <pre className="text-xs md:text-sm text-gray-300">
                {`Copyright (c) 2023 Ishant Mishra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
              </pre>
            </div>
            <p className="text-gray-300 text-sm md:text-base">
              This license gives everyone the freedom to use, modify, and distribute the code.
            </p>
          </div>
        </div>
      </div>
  );
};

export default Contribute;