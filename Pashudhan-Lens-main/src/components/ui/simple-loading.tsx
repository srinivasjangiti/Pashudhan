import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SimpleLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  variant?: 'light' | 'dark';
}

/**
 * Simple loading overlay - Just a centered spinner without changing backgrounds
 * Maintains layout stability by overlaying on existing content
 */
export const SimpleLoadingOverlay: React.FC<SimpleLoadingOverlayProps> = memo(({
  isLoading,
  message = 'Loading...',
  variant = 'light',
}) => {
  // Glass morphism styles based on variant
  const glassStyles = variant === 'dark' ? {
    background: 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  } : {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  };

  const textColor = variant === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';
  const textShadow = variant === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.5)' : '0 1px 2px rgba(255, 255, 255, 0.5)';
  const spinnerInner = variant === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)';

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: 'transparent', // Fully transparent background
          }}
        >
          {/* Apple-style glass morphism container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.1, 0.25, 1],
              type: "spring",
              damping: 20,
              stiffness: 300
            }}
            className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl"
            style={glassStyles}
          >
            {/* Beautiful gradient spinner */}
            <div 
              className="w-10 h-10 rounded-full animate-spin"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(16, 185, 129, 0.8), transparent)',
                padding: '2px',
              }}
            >
              <div 
                className="w-full h-full rounded-full"
                style={{
                  background: spinnerInner,
                }}
              />
            </div>
            
            {/* Loading message with elegant typography */}
            <span 
              className="text-sm font-medium tracking-wide"
              style={{
                color: textColor,
                textShadow: textShadow,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {message}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SimpleLoadingOverlay.displayName = 'SimpleLoadingOverlay';

// Page transition wrapper that keeps content stable with prioritized background loading
interface StablePageWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  loadingMessage?: string;
  glassVariant?: 'light' | 'dark';
  background?: 'default' | 'upload' | 'results' | string;
}

export const StablePageWrapper: React.FC<StablePageWrapperProps> = memo(({
  children,
  isLoading = false,
  className = '',
  loadingMessage = 'Loading...',
  glassVariant = 'light',
  background = 'default',
}) => {
  // Background styles to apply immediately (even during loading)
  const getBackgroundStyle = () => {
    if (background === 'default') return 'bg-gradient-to-br from-emerald-50 to-green-50';
    if (background === 'upload') return 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900';
    if (background === 'results') return 'bg-gradient-to-br from-purple-900 via-emerald-900 to-slate-900';
    return background; // Custom background class if provided
  };

  // Use this to determine if we should show the loading overlay
  const shouldShowFullPageLoading = isLoading;
  
  return (
    <div className={`relative min-h-screen ${getBackgroundStyle()} ${className}`}>
      {/* Always render children but control their opacity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
        style={{ 
          // Still keep content in the DOM while loading
          pointerEvents: isLoading ? 'none' : 'auto',
        }}
      >
        {children}
      </motion.div>

      {/* Loading overlay appears on top with a fade-in/out transition */}
      <AnimatePresence>
        {shouldShowFullPageLoading && (
          <motion.div
            key="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ 
              // Allow background to be visible through the overlay
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Apple-style glass morphism container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ 
                duration: 0.3, 
                ease: [0.25, 0.1, 0.25, 1],
                type: "spring",
                damping: 20,
                stiffness: 300
              }}
              className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl"
              style={glassVariant === 'dark' ? {
                background: 'rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              } : {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Beautiful gradient spinner */}
              <div 
                className="w-10 h-10 rounded-full animate-spin"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(16, 185, 129, 0.8), transparent)',
                  padding: '2px',
                }}
              >
                <div 
                  className="w-full h-full rounded-full"
                  style={{
                    background: glassVariant === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  }}
                />
              </div>
              
              {/* Loading message with elegant typography */}
              <span 
                className="text-sm font-medium tracking-wide"
                style={{
                  color: glassVariant === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                  textShadow: glassVariant === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.5)' : '0 1px 2px rgba(255, 255, 255, 0.5)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {loadingMessage}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

StablePageWrapper.displayName = 'StablePageWrapper';
