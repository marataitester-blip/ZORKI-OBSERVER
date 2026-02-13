
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
    <div className="mb-14 relative z-20 bg-black">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-700 mb-5 font-black">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {options.map((option) => {
          const isActive = activeValue === option;
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`px-5 py-5 text-left flex flex-col justify-between border transition-all duration-300 h-32 group relative outline-none ${
                isActive
                  ? 'bg-white border-white ring-1 ring-white shadow-xl'
                  : 'bg-black border-zinc-900 hover:border-zinc-700'
              }`}
            >
              <span className={`text-[10px] font-black tracking-tight mb-3 ${
                isActive ? 'text-black' : 'text-zinc-500 group-hover:text-white'
              }`}>
                {formatter ? formatter(option) : option}
              </span>
              
              {descriptions && descriptions[option] && (
                <span className={`text-[9px] leading-tight font-medium transition-opacity ${
                  isActive ? 'text-zinc-900 opacity-100' : 'text-zinc-700 group-hover:text-zinc-400'
                }`}>
                  {descriptions[option]}
                </span>
              )}

              {/* Индикатор активности сверху */}
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-black/5"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
