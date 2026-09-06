import React from 'react';

interface JVLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const JVLogo: React.FC<JVLogoProps> = ({ className = '', size = 'md' }) => {
  const dimensions = {
    sm: { box: 'w-9 h-9', font: 'text-sm' },
    md: { box: 'w-11 h-11', font: 'text-base' },
    lg: { box: 'w-14 h-14', font: 'text-xl' },
  }[size];

  return (
    <div
      id="jv-brand-logo"
      className={`relative inline-flex items-center justify-center rounded-xl bg-black border border-[#CCFF00] shadow-[0_0_15px_rgba(204,255,0,0.3)] shrink-0 select-none overflow-hidden ${dimensions.box} ${className}`}
      title="JV Salvaia Personal Trainer"
    >
      <div className="flex flex-col items-center justify-center leading-none">
        <span className={`font-display font-black tracking-tighter text-[#CCFF00] ${dimensions.font}`}>
          JV
        </span>
        <span className="text-[7px] font-mono font-bold text-white tracking-widest uppercase mt-[-1px]">
          SALVAIA
        </span>
      </div>
    </div>
  );
};
