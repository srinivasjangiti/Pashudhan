import React, { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { SharedLayout } from '@/components/SharedLayout';
import { CritterTypewriter } from '@/components/CritterTypewriter';
import { Leaf, Binoculars, Camera, ArrowRight, Home as HomeIcon, Upload, Info, Search, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-wildlife.jpg';

interface HomeProps {
  onGetStarted: () => void;
  onNavigateAbout?: () => void;
  onNavigateLibrary?: () => void;
}

const Home = memo<HomeProps>(({ onGetStarted, onNavigateAbout, onNavigateLibrary }) => {
  // Memoize navigation items to prevent re-creation
  const navItems = useMemo(() => [
    { name: 'Home', url: '#home', icon: HomeIcon },
    { name: 'Identify', url: '#identify', icon: Search },
    { name: 'Upload', url: '#upload', icon: Upload },
    { name: 'Library', url: '#library', icon: BookOpen },
    { name: 'About', url: '#about', icon: Info }
  ], []);

  // Memoize feature items
  const features = useMemo(() => [
    { icon: Camera, text: 'AI Breed Analysis' },
    { icon: Binoculars, text: 'Breed Library' },
    { icon: Leaf, text: 'BPA Integration' }
  ], []);

  const handleNavClick = (item: any) => {
    if (item.name === 'Upload' || item.name === 'Identify') {
      onGetStarted();
    } else if (item.name === 'About' && onNavigateAbout) {
      onNavigateAbout();
    } else if (item.name === 'Library' && onNavigateLibrary) {
      onNavigateLibrary();
    }
    // For other nav items, you can add scroll to sections or other actions
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Optimized background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          willChange: 'auto' // Optimize for rendering
        }}
      />
      
      {/* Enhanced overlay with better contrast for content visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/35 backdrop-blur-[1px] backdrop-saturate-150">
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-black/15" />
        {/* Additional black overlay for better component visibility */}
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Tubelight Navigation Bar */}
      <NavBar items={navItems} onItemClick={handleNavClick} currentPage="Home" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl font-heading font-normal mb-6 leading-tight tracking-tight text-white drop-shadow-2xl shadow-black/80"
            >
              Cattle & Buffalo
              <span className="block bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
                Breed Recognition
              </span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <CritterTypewriter />
            </motion.div>
            
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button 
                onClick={onGetStarted}
                variant="default"
                className="text-lg px-12 py-4 h-auto shadow-lg hover:shadow-xl"
              >
                Start Breed Analysis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {features.map(({ icon: Icon, text }, index) => (
                <motion.div 
                  key={text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + (index * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-emerald-200/50 rounded-xl px-6 py-3 shadow-md transition-all duration-300 hover:shadow-lg hover:bg-white text-emerald-700"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
