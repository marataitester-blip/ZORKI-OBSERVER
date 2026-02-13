
import React from 'react';

interface StateSwitchProps<T extends string> {
  label: string;
  options: T[];
  activeValue: T;
  onChange: (value: T) => void;
  descriptions?: Record<string, string>;
  formatter?: (value: T) => string;
}

export const StateSwitch = <T extends string,>({ 
  label, 
  options, 
  activeValue, 
  onChange,
  descriptions,
  formatter
}: StateSwitchProps<T>) => {
  return (
    <div className="mb-12 relative z-20">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-4 font-bold">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
        {options.map((option) => {
          const isActive = activeValue === option;
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`px-4 py-4 text-left flex flex-col justify-between border transition-all duration-300 h-28 group relative ${
                isActive
                  ? 'bg-white border-white'
                  : 'bg-black border-zinc-900 hover:border-zinc-700'
              }`}
            >
              <span className={`text-[10px] font-bold tracking-tight mb-2 ${
                isActive ? 'text-black' : 'text-zinc-400 group-hover:text-white'
              }`}>
                {formatter ? formatter(option) : option}
              </span>
              
              {descriptions && descriptions[option] && (
                <span className={`text-[9px] leading-snug font-light transition-opacity ${
                  isActive ? 'text-zinc-800 opacity-90' : 'text-zinc-600 group-hover:text-zinc-400 opacity-70'
                }`}>
                  {descriptions[option]}
                </span>
              )}

              {/* Акцентная полоса для активного состояния */}
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-0.5 bg-black/10"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
