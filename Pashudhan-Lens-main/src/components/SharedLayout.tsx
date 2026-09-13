import React from 'react';

interface SharedLayoutProps {
  children: React.ReactNode;
  background?: 'default' | 'upload' | 'results';
  className?: string;
}

const backgroundStyles = {
  default: 'bg-gradient-to-br from-emerald-50 to-green-50',
  upload: 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900',
  results: 'bg-gradient-to-br from-purple-900 via-emerald-900 to-slate-900'
};

export const SharedLayout: React.FC<SharedLayoutProps> = ({ 
  children, 
  background = 'default',
  className = ""
}) => {
  return (
    <div
      className={`
        min-h-screen relative
        ${backgroundStyles[background]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
