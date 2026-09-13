import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PageBackgroundProps {
  variant: 'default' | 'upload' | 'results' | 'library';
  opacity?: number;
  className?: string;
  priority?: boolean; // If true, loads immediately
}

export const PageBackground: React.FC<PageBackgroundProps> = ({
  variant,
  opacity = 1,
  className = '',
  priority = true,
}) => {
  // State to track if background is loaded
  const [isLoaded, setIsLoaded] = useState(priority);
  
  useEffect(() => {
    if (!priority) {
      // Load non-priority backgrounds after a short delay
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [priority]);
  
  // Background configurations
  const getBackground = () => {
    switch (variant) {
      case 'default':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 transition-opacity duration-500" />
        );
      case 'upload':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 transition-opacity duration-500" />
            {isLoaded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-upload-pattern bg-cover bg-center mix-blend-overlay"
              />
            )}
          </>
        );
      case 'results':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-emerald-900 to-slate-900 transition-opacity duration-500" />
            {isLoaded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 overflow-hidden"
              >
                {/* Subtle animated particles */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.3 + 0.1,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </>
        );
      case 'library':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 transition-opacity duration-500" />
            {isLoaded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-library-pattern bg-cover bg-center mix-blend-soft-light"
              />
            )}
          </>
        );
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 transition-opacity duration-500" />
        );
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-0 transition-opacity duration-500 ${className}`}
      style={{ opacity }}
    >
      {getBackground()}
    </div>
  );
};
