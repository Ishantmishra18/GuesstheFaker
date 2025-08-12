import React from 'react';
import { motion } from 'framer-motion';
import { FaYoutube } from 'react-icons/fa';

const HowToPlay = ({ close }) => {
  return (
    <motion.div
      className="relative w-full max-w-3xl p-6 max-h-[90vh] bg-gray-900 text-white rounded-xl shadow-xl border border-gray-700"
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 20 }}
    >
      {/* Close button */}
      <button 
        onClick={() => close(false)}
        className="absolute top-4 right-12 text-xl text-gray-400 hover:text-white transition-colors p-2 z-50 cursor-pointer"
        aria-label="Close how to play"
      >
        ✕
      </button>

      {/* Content */}
      <div className="h-full py-6 md:p-8 overflow-y-scroll">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            How to Play Guess the Faker
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            A game of deception where one player doesn't know they're the faker!
          </p>
        </div>

         {/* Pro Tip */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-gray-300">💡</div>
            <div>
              <p className="text-gray-300">
                <span className="font-medium">Pro Tip:</span> Best played on voice chat (Discord, Zoom) for live discussion!
              </p>
            </div>
          </div>
        </div>

        {/* Watch Demo Button */}
        <div className="flex justify-center mb-8">
          <a
            href="https://www.youtube.com/shorts/Ny3OAEH43rM"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
          >
            <FaYoutube className="mr-2" />
            Watch Demo on YouTube
          </a>
        </div>

        {/* Game Steps */}
        <div className="space-y-6 mb-7">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold">1</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">The Secret Imposter</h3>
              <p className="text-gray-400">
                One random player becomes the <span className="text-red-400">Imposter</span> but doesn't know it yet. Everyone receives the same question except the imposter.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold">2</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Answer Phase</h3>
              <p className="text-gray-400">
                All players answer their questions. The <span className="text-red-400">Imposter</span> answers naturally, unaware their question was different.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold">3</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">The Big Reveal</h3>
              <p className="text-gray-400">
                The real question is shown. The <span className="text-red-400">Imposter</span> must pretend they answered the real question!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-bold">4</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Voting Phase</h3>
              <p className="text-gray-400">
                Players discuss and vote. The <span className="text-red-400">Imposter</span> wins if undetected, others win if they spot the faker.
              </p>
            </div>
          </div>
        </div>

       
      </div>
    </motion.div>
  );
};

export default HowToPlay;