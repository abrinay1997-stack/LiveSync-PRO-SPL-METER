
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Icon with glow using external image */}
      <div className="relative w-12 h-12 mb-4 group">
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <img 
          src="https://hostedimages-cdn.aweber-static.com/MjM0MTQ0NQ==/optimized/20657f92efa544489526caee3beef9d2.png" 
          alt="LiveSync Pro Icon"
          className="relative w-full h-full object-contain opacity-90"
        />
      </div>
      
      {/* Text: LiveSync in white (CamelCase), PRO in gradient (Uppercase), same line */}
      <h1 className="text-xl font-bold tracking-[0.2em] whitespace-nowrap">
        <span className="text-white">LiveSync</span>{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase">
          PRO
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="text-[#666] text-[10px] uppercase tracking-widest mt-1 font-bold">
        System Engineering Suite
      </p>
    </div>
  );
};

export default Logo;
