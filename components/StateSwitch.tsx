
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
    <div className="mb-14 relative z-40 isolate">
      <h3 className="text-xs uppercase tracking-[0.25em] text-zinc-500 mb-6 font-black relative z-50">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-40">
        {options.map((option) => {
          const isActive = activeValue === option;
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`px-5 py-6 text-left flex flex-col justify-between border-2 transition-all duration-300 h-40 group relative outline-none shadow-sm isolate overflow-hidden ${
                isActive
                  ? 'bg-[#D4AF37] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] z-50'
                  : 'bg-white/70 border-zinc-200 hover:border-[#D4AF37] hover:gold-glow z-40'
              }`}
            >
              {/* Фактический фон кнопки для обеспечения непрозрачности под текстом */}
              <div className={`absolute inset-0 -z-10 ${isActive ? 'bg-[#D4AF37]' : 'bg-white/60'}`}></div>
              
              <span className={`text-base font-black tracking-tight mb-3 relative z-50 leading-tight uppercase ${
                isActive ? 'text-black' : 'text-black opacity-90 group-hover:opacity-100'
              }`}>
                {formatter ? formatter(option) : option}
              </span>
              
              {descriptions && descriptions[option] && (
                <span className={`text-xs leading-snug font-bold transition-opacity relative z-50 ${
                  isActive ? 'text-black/70' : 'text-zinc-600 group-hover:text-black/70'
                }`}>
                  {descriptions[option]}
                </span>
              )}

              {/* Декоративная подложка */}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20 z-50"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
