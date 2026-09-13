import React, { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { Home as HomeIcon, Upload, Info, Search, BookOpen, Zap, Shield, Users, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-wildlife.jpg';
import { useAppContext } from '@/contexts/AppContext';

interface AboutProps {
  onGetStarted: () => void;
  onNavigateHome: () => void;
  onNavigateLibrary?: () => void;
}

const About = memo<AboutProps>(({ onGetStarted, onNavigateHome, onNavigateLibrary }) => {
  const { state } = useAppContext();
  // Memoize navigation items to prevent re-creation
  const navItems = useMemo(() => [
    { name: 'Home', url: '#home', icon: HomeIcon },
    { name: 'Identify', url: '#identify', icon: Search },
    { name: 'Upload', url: '#upload', icon: Upload },
    { name: 'Library', url: '#library', icon: BookOpen },
    { name: 'About', url: '#about', icon: Info }
  ], []);

  // About page specific features
  const aboutFeatures = useMemo(() => [
    { icon: Zap, title: 'AI-Powered Recognition', description: 'Advanced machine learning algorithms for accurate breed identification' },
    { icon: BookOpen, title: 'Extensive Library', description: 'Detailed information on Indian cattle and buffalo breeds' },
    { icon: Shield, title: 'BPA Integration', description: 'Seamlessly integrated with Bharat Pashudhan App ecosystem' },
    { icon: Users, title: 'Farmer-Centric', description: 'Designed to empower farmers and livestock professionals' },
    { icon: Award, title: 'High Accuracy', description: 'State-of-the-art precision in breed classification' },
    { icon: Target, title: 'Instant Results', description: 'Get breed identification results in seconds' }
  ], []);

  const handleNavClick = (item: any) => {
    if (item.name === 'Upload' || item.name === 'Identify') {
      onGetStarted();
    } else if (item.name === 'Home') {
      onNavigateHome();
    } else if (item.name === 'Library' && onNavigateLibrary) {
      onNavigateLibrary();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Same background as homepage for consistency */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          willChange: 'auto'
        }}
      />
      
      {/* Enhanced overlay with better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/35 backdrop-blur-[1px] backdrop-saturate-150">
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-black/15" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Tubelight Navigation Bar */}
      <NavBar items={navItems} onItemClick={handleNavClick} currentPage="About" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center pt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-5xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-6xl font-heading font-normal mb-4 leading-tight tracking-tight text-white drop-shadow-2xl shadow-black/80"
              >
                About
                <span className="block bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
                  Pashudhan Lens
                </span>
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/95 backdrop-blur-sm rounded-xl border border-emerald-100/50 p-6 mb-8 shadow-lg"
              >
                <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto font-body leading-relaxed">
                  AI-powered breed identification for Indian cattle and buffalo breeds, supporting the Bharat Pashudhan App ecosystem.
                </p>
              </motion.div>
            </div>

            {/* Mission Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-10"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-100/50 p-6 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-center text-gray-800">
                  Our Mission
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                  Empowering farmers and livestock professionals with AI technology for accurate breed identification, 
                  bridging traditional animal husbandry with modern solutions.
                </p>
              </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
            >
              {aboutFeatures.map(({ icon: Icon, title, description }, index) => (
                <motion.div 
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Technology Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-100/50 p-6 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4 text-center text-gray-800">
                  Powered by Advanced AI
                </h2>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="text-base text-gray-700 leading-relaxed mb-3">
                      State-of-the-art computer vision and machine learning for accurate breed identification.
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed">
                      Trained specifically on Indian cattle and buffalo breeds for reliable results.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-emerald-600 mb-1">95%+</div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-emerald-600 mb-1">50+</div>
                      <div className="text-xs text-gray-600">Breeds</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-emerald-600 mb-1">&lt;15s</div>
                      <div className="text-xs text-gray-600">Response</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-emerald-600 mb-1">24/7</div>
                      <div className="text-xs text-gray-600">Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-center"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-emerald-100/50 p-6 shadow-lg">
                <h2 className="text-xl md:text-2xl font-heading font-semibold mb-3 text-gray-800">
                  Ready to Get Started?
                </h2>
                <p className="text-base text-gray-700 mb-4 max-w-2xl mx-auto">
                  Experience AI-driven breed identification. Upload an image and get instant results.
                </p>
                <Button 
                  onClick={onGetStarted}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-base px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Try Breed Analysis
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
});

About.displayName = 'About';

export default About;
