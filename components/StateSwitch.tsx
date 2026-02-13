
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
    <div className="mb-14 relative z-20">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-5 font-black">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {options.map((option) => {
          const isActive = activeValue === option;
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`px-5 py-5 text-left flex flex-col justify-between border transition-all duration-300 h-32 group relative outline-none shadow-sm ${
                isActive
                  ? 'bg-[#D4AF37] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  : 'bg-white/50 border-zinc-200 hover:border-[#D4AF37] hover:gold-glow'
              }`}
            >
              <span className={`text-[11px] font-black tracking-tight mb-3 ${
                isActive ? 'text-black' : 'text-black opacity-80 group-hover:opacity-100'
              }`}>
                {formatter ? formatter(option) : option}
              </span>
              
              {descriptions && descriptions[option] && (
                <span className={`text-[9px] leading-tight font-medium transition-opacity ${
                  isActive ? 'text-black/80' : 'text-zinc-500 group-hover:text-black/60'
                }`}>
                  {descriptions[option]}
                </span>
              )}

              {/* Декоративная подложка-градиент снизу */}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black/10"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
