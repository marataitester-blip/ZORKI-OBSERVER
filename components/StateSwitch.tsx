
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
    <div className="mb-10">
      <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4 font-semibold">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`px-4 py-3 text-xs border transition-all duration-200 text-left flex flex-col justify-between h-full ${
              activeValue === option
                ? 'bg-white text-black border-white'
                : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
            }`}
          >
            <span className="font-bold mb-1">{formatter ? formatter(option) : option}</span>
            {descriptions && descriptions[option] && (
              <span className={`text-[10px] leading-tight opacity-70 ${activeValue === option ? 'text-zinc-800' : 'text-zinc-500'}`}>
                {descriptions[option]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
