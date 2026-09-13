import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, BookOpen, Info, Home as HomeIcon } from 'lucide-react';
import { NavBar } from '@/components/ui/tubelight-navbar';
import libraryBg from '@/assets/library_bg.jpeg';

const Library: React.FC = () => {
  const navigate = useNavigate();

  // Navigation items
  const navItems = [
    { name: 'Home', url: '#home', icon: HomeIcon },
    { name: 'Identify', url: '#identify', icon: Search },
    { name: 'Upload', url: '#upload', icon: Upload },
    { name: 'Library', url: '#library', icon: BookOpen },
    { name: 'About', url: '#about', icon: Info }
  ];

  const handleNavClick = (item: any) => {
    if (item.name === 'Upload' || item.name === 'Identify') {
      navigate('/upload');
    } else if (item.name === 'Home') {
      navigate('/');
    } else if (item.name === 'About') {
      navigate('/about');
    }
    // Library is current page, so no navigation needed
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ 
          backgroundImage: `url(${libraryBg})`,
          willChange: 'auto'
        }}
      />
      
      {/* Enhanced overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/35 backdrop-blur-[1px] backdrop-saturate-150">
        <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-black/15" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Navigation */}
      <NavBar items={navItems} onItemClick={handleNavClick} currentPage="Library" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-24 flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl shadow-black/80">
            Breed Library
          </h1>
          <p className="text-lg text-white/90 max-w-3xl mx-auto drop-shadow-lg mb-8">
            The library feature is currently under maintenance as we transition to a new system.
            Please check back later for our comprehensive collection of cattle and buffalo breeds.
          </p>
          
          <div className="p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-2xl mx-auto">
            <BookOpen className="w-16 h-16 text-white mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-semibold text-white mb-2">Coming Soon</h2>
            <p className="text-white/80">
              We are working on an improved library experience that will be available offline and open-source.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Library;
