import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface EnhancedSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'button' | 'avatar' | 'shimmer';
  width?: string;
  height?: string;
  lines?: number;
  delayMs?: number;
  isLoaded?: boolean;
}

export const EnhancedSkeleton: React.FC<EnhancedSkeletonProps> = ({ 
  className = "", 
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  delayMs = 0,
  isLoaded = false
}) => {
  const [isVisible, setIsVisible] = useState(delayMs === 0);
  
  useEffect(() => {
    if (delayMs > 0) {
      const timer = setTimeout(() => setIsVisible(true), delayMs);
      return () => clearTimeout(timer);
    }
  }, [delayMs]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded-md';
      case 'circular':
        return 'rounded-full aspect-square';
      case 'button':
        return 'h-10 rounded-lg';
      case 'avatar':
        return 'rounded-full w-12 h-12';
      case 'shimmer':
        return 'rounded-lg relative overflow-hidden';
      case 'rectangular':
      default:
        return 'rounded-lg';
    }
  };

  // Use less aggressive animation to prevent flickering
  const shimmerClasses = variant === 'shimmer' 
    ? 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_3s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent'
    : '';

  // Exit animation when content is loaded
  if (isLoaded) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-r from-white/5 via-white/10 to-white/5 ${getVariantClasses()} ${shimmerClasses}`}
            style={{ 
              width: i === lines - 1 ? '75%' : width || '100%',
              height: height || 'auto'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r from-white/5 via-white/10 to-white/5 ${getVariantClasses()} ${shimmerClasses} ${className}`}
      style={{ width, height }}
    />
  );
};

// Component to render a skeleton first and then smoothly transition to the actual content
interface ContentWithSkeletonProps {
  children: React.ReactNode;
  isLoading: boolean;
  skeleton: React.ReactNode;
  className?: string;
}

export const ContentWithSkeleton: React.FC<ContentWithSkeletonProps> = ({
  children,
  isLoading,
  skeleton,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Content always renders, even during loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
      
      {/* Skeleton overlay */}
      {isLoading && (
        <div className="absolute inset-0">
          {skeleton}
        </div>
      )}
    </div>
  );
};
