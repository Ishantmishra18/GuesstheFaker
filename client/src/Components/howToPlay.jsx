import React from 'react';
import { motion } from 'framer-motion';

const HowToPlay = ({ close }) => {
  return (
    <motion.div 
      className="w-full max-w-2xl bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-6 border-2 border-yellow-400 shadow-2xl relative overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/20 blur-xl"></div>
      
      {/* Close button */}
      <button 
        onClick={() => close(false)}
        className="absolute top-4 right-4 text-2xl text-yellow-400 hover:text-white transition-colors p-2 z-50 cursor-pointer"
        aria-label="Close how to play"
      >
        ✕
      </button>

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
          How to Play Guess the Faker
        </h2>
        
        <div className="mb-6 p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
          <div className="flex items-center gap-2 text-yellow-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">Best experienced on voice chat (Discord, Zoom, etc.) for live discussion during voting!</p>
          </div>
        </div>
        
        <div className="space-y-4 text-white/90">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold">1</div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-300">The Secret Imposter</h3>
              <p>One random player becomes the <span className="text-red-400 font-medium">Imposter</span> but <span className="underline">doesn't know it yet</span>. Everyone receives the same question except the imposter, who gets a slightly different one.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400 font-bold">2</div>
            <div>
              <h3 className="text-xl font-semibold text-blue-300">Answer Phase</h3>
              <p>All players answer their questions thinking they're legitimate. The <span className="text-red-400 font-medium">Imposter</span> answers naturally, unaware their question was different.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center text-purple-400 font-bold">3</div>
            <div>
              <h3 className="text-xl font-semibold text-purple-300">The Big Reveal</h3>
              <p>The <span className="text-green-400 font-medium">real question</span> is shown alongside all answers. Now the <span className="text-red-400 font-medium">Imposter</span> must pretend they answered the real question!</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center text-green-400 font-bold">4</div>
            <div>
              <h3 className="text-xl font-semibold text-green-300">Voting Phase</h3>
              <p>Players discuss and vote. The <span className="text-red-400 font-medium">Imposter</span> wins if they avoid detection, while others win if they correctly identify the faker!</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HowToPlay;