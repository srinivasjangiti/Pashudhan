import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home, Upload, Search, Plus } from 'lucide-react';
import { UserButton, SignedIn } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BreadcrumbProps {
  onNewUpload?: () => void;
}

const pageInfo = {
  '/': { label: 'Home', icon: Home, color: 'text-emerald-400' },
  '/home': { label: 'Home', icon: Home, color: 'text-emerald-400' },
  '/about': { label: 'About', icon: Home, color: 'text-indigo-400' },
  '/upload': { label: 'Upload', icon: Upload, color: 'text-blue-400' },
  '/results': { label: 'Breed Results', icon: Search, color: 'text-purple-400' }
};

export const RouterNavigationBreadcrumb: React.FC<BreadcrumbProps> = ({ 
  onNewUpload
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // On results page, fade out when scrolling down
      if (currentPath === '/results') {
        // Start fading out after 50px scroll, completely hidden after 150px
        const fadeThreshold = 50;
        const hideThreshold = 150;
        
        if (currentScrollY <= fadeThreshold) {
          setIsVisible(true);
        } else if (currentScrollY >= hideThreshold) {
          setIsVisible(false);
        } else {
          // Gradual fade between thresholds
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  // Calculate opacity based on scroll position for results page
  const getOpacity = () => {
    if (currentPath !== '/results') return 1;
    
    const fadeThreshold = 50;
    const hideThreshold = 150;
    
    if (scrollY <= fadeThreshold) return 1;
    if (scrollY >= hideThreshold) return 0;
    
    // Linear fade between thresholds
    return 1 - ((scrollY - fadeThreshold) / (hideThreshold - fadeThreshold));
  };

  const getPages = () => {
    switch (currentPath) {
      case '/':
      case '/home':
        return ['/'];
      case '/about':
        return ['/'];
      case '/upload':
        return ['/', '/upload'];
      case '/results':
        return ['/', '/upload', '/results'];
      default:
        return ['/'];
    }
  };

  const pages = getPages();

  const handleNavigate = (path: string) => {
    if (path !== currentPath) {
      navigate(path);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: getOpacity(), 
        y: 0 
      }}
      transition={{ 
        opacity: { duration: 0.3 },
        y: { duration: 0.6 }
      }}
      className="fixed top-6 left-6 z-50 flex items-center gap-4"
      style={{ 
        pointerEvents: getOpacity() < 0.1 ? 'none' : 'auto',
        transform: `translateY(${currentPath === '/results' && scrollY > 50 ? -scrollY * 0.2 : 0}px)`,
      }}
    >
      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-black/80 via-black/70 to-black/80 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 shadow-2xl">
        <div className="flex items-center gap-2">
          {pages.map((page, index) => {
            const PageIcon = pageInfo[page as keyof typeof pageInfo].icon;
            const isLast = index === pages.length - 1;
            const isClickable = page !== currentPath && (page === '/' || page === '/upload');
            
            return (
              <React.Fragment key={page}>
                <motion.button
                  onClick={() => isClickable && handleNavigate(page)}
                  className={`
                    flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-200
                    ${isLast 
                      ? 'text-white bg-white/20 font-semibold' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    }
                    ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                  `}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                >
                  <PageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {pageInfo[page as keyof typeof pageInfo].label}
                  </span>
                </motion.button>
                
                {!isLast && (
                  <ChevronRight className="w-4 h-4 text-white/60" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Quick Actions for Results Page */}
      {currentPath === '/results' && onNewUpload && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <motion.button
            onClick={onNewUpload}
            className="bg-emerald-600/90 backdrop-blur-xl text-white px-4 py-2 rounded-full border border-emerald-500/50 shadow-2xl hover:bg-emerald-500 transition-all duration-200 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Analysis</span>
          </motion.button>
        </motion.div>
      )}

      {/* User Account Button - Only show when signed in */}
      <SignedIn>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center"
        >
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 border-2 border-white/30",
                userButtonPopoverCard: "bg-black/90 backdrop-blur-xl border border-white/20"
              }
            }}
          />
        </motion.div>
      </SignedIn>
    </motion.div>
  );
};
