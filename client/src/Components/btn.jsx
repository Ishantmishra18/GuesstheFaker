import React from 'react';

const Btn = ({ text, handle, style = true, dull = false, disabled = false, className = '', icon = null }) => {
  // Base classes that apply to all buttons
  const baseClasses = `relative px-6 py-3 rounded-lg whitespace-nowrap tracking-wider overflow-hidden transition-all duration-300 font-medium ${className}`;
  
  // Style 1: Glowing Neon Button
  if (style) {
    return (
      <button 
        onClick={handle}
        disabled={disabled || dull}
        className={`${baseClasses} group ${dull ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {/* Background gradient with reduced opacity when dull */}
        <span className={`absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg transition-opacity ${
          dull ? 'opacity-30' : 'opacity-75 group-hover:opacity-100'
        }`}></span>
        
        {/* Button edge highlights - hidden when dull */}
        {!dull && (
          <>
            <span className="absolute top-0 left-0 w-full h-0.5 bg-white/50"></span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white/50"></span>
          </>
        )}
        
        {/* Main button content */}
        <span className="relative z-10 flex items-center justify-center gap-2 text-white">
          {icon && <span className="text-lg">{icon}</span>}
          {text}
          {!dull && <span className="group-hover:translate-x-1 transition-transform">→</span>}
        </span>
        
        {/* Hover animation - disabled when dull */}
        {!dull && (
          <span className="absolute inset-0 border-2 border-white/20 rounded-lg group-hover:border-white/40"></span>
        )}
      </button>
    );
  }

  // Style 2: Cyberpunk Button
  return (
    <button 
      onClick={handle}
      disabled={disabled || dull}
      className={`${baseClasses} font-mono font-bold border-2 ${
        dull 
          ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed'
          : ' bg-neutral-800 text-pink-400 border-pink-400 hover:border-pink-200 hover:text-pink-200 cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_20px_rgba(236,72,153,0.8)]'
      }`}
    >
      {/* Pixel corners - change color when dull */}
      <span className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${
        dull ? 'border-gray-600' : 'border-pink-400'
      }`}></span>
      <span className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${
        dull ? 'border-gray-600' : 'border-pink-400'
      }`}></span>
      <span className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${
        dull ? 'border-gray-600' : 'border-pink-400'
      }`}></span>
      <span className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${
        dull ? 'border-gray-600' : 'border-pink-400'
      }`}></span>
      
      {/* Text with scanline effect - disabled when dull */}
      <span className="relative">
        <span className={`block h-6 overflow-hidden ${
          dull ? '' : 'hover:text-white'
        }`}>
          <span className={`block ${
            dull ? '' : 'animate-[scanline_8s_linear_infinite]'
          }`}>
            {text.split('').map((char, i) => (
              <span 
                key={i} 
                className={`inline-block min-w-[0.5em] ${
                  dull ? '' : 'hover:scale-110 transition-transform duration-100'
                }`}
                style={dull ? {} : { animationDelay: `${i * 0.05}s` }}
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      </span>
    </button>
  );
};

export default Btn;