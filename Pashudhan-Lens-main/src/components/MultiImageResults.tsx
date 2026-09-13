import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { WebGLShader } from '@/components/ui/web-gl-shader';
import { 
  ArrowLeft, 
  Binoculars, 
  CheckCircle, 
  Star, 
  MapPin, 
  Calendar, 
  Shield, 
  Upload,
  AlertTriangle,
  Eye,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Images,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { extractBreedCharacteristicsFromDescription } from '@/utils/breedCharacteristicsExtractor';
import uploadBg from '@/assets/upload_bg.png';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  status: 'pending' | 'uploading' | 'analyzing' | 'complete' | 'error';
  progress?: number;
  results?: any;
  error?: string;
}

interface SpeciesIdentification {
  species: string;
  commonName?: string;
  confidence?: number;
  description?: string;
  habitat?: string;
  conservation?: string;
  isIndianBreed?: boolean;
  error?: string;
  message?: string;
  bpaRegistrationNotes?: string;
  breedCharacteristics?: {
    bodyStructure?: string;
    colorPattern?: string;
    hornCharacteristics?: string;
    earShape?: string;
    facialFeatures?: string;
    humpPresence?: string;
    overallConformation?: string;
  };
  metadata?: {
    estimatedAge?: string;
    estimatedSize?: string;
    imageQualityNotes?: string;
    environmentalContext?: string;
  };
}

interface MultiImageResultsUnifiedProps {
  images: UploadedImage[];
  onNewUpload: () => void;
  summary?: {
    totalImages: number;
    successfulAnalyses: number;
    failedAnalyses: number;
    totalBreedsIdentified: number;
    processingTime: number;
    averageConfidence?: number;
    mostCommonBreeds?: string[];
  };
  showEnhancedView?: boolean;
}

const MultiImageResultsUnified = memo<MultiImageResultsUnifiedProps>(({ 
  images, 
  onNewUpload, 
  summary,
  showEnhancedView = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'standard' | 'enhanced'>('standard');
  const { toast } = useToast();

  // Get current image and its results
  const currentImage = images[currentImageIndex];
  const hasResults = currentImage?.results && Array.isArray(currentImage.results.breeds) && currentImage.results.breeds.length > 0;
  const validResults = hasResults ? currentImage.results.breeds.filter((result: SpeciesIdentification) => 
    result.species && 
    !result.error && 
    result.species.trim() !== ''
  ) : [];

  // Calculate statistics for header
  const stats = useMemo(() => {
    const successful = images.filter(img => 
      img.status === 'complete' && 
      img.results && 
      img.results.breeds && 
      img.results.breeds.length > 0 &&
      img.results.breeds.some((breed: SpeciesIdentification) => 
        breed.species && !breed.error && breed.species.trim() !== '')
    ).length;
    
    return { total: images.length, successful };
  }, [images]);

  // Download current image results
  const downloadResults = () => {
    if (!hasResults) return;
    
    const data = {
      timestamp: new Date().toISOString(),
      imageIndex: currentImageIndex + 1,
      results: validResults
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cattle-buffalo-breed-identification-image-${currentImageIndex + 1}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle validation - show error state if no results
  if (!currentImage || !hasResults || validResults.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Same background as single image results */}
        <div className="absolute inset-0 z-0">
          <WebGLShader />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div 
          className="absolute inset-0 z-1 bg-cover bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: `url(${uploadBg})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-black/15"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-black/10"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6">
          <div className="text-center text-white max-w-2xl mx-auto">
            <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Analysis Failed</h2>
            <p className="text-white/80 mb-6 sm:mb-8 text-base sm:text-lg">
              {currentImage?.error || 'Unable to identify any valid Indian cattle or buffalo breeds in this image.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                onClick={onNewUpload}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base w-full sm:w-auto"
              >
                Try New Images
              </Button>
              {images.length > 1 && (
                <Button 
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base w-full sm:w-auto"
                >
                  Next Image
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* EXACT same background as single image results */}
      <div className="absolute inset-0 z-0">
        <WebGLShader />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div 
        className="absolute inset-0 z-1 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: `url(${uploadBg})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-black/15"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-black/10"></div>
      </div>
      
      {/* Content - EXACT same structure as single image */}
      <div className="relative z-10 min-h-screen pt-16 pb-12">
        {/* Hero Section - Enhanced for multi-image */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12"
        >
          <div className="max-w-6xl mx-auto text-center">
            {/* Navigation for multiple images */}
            {images.length > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
              >
                <Button
                  onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex === 0}
                  variant="outline"
                  size="sm"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-xl disabled:opacity-50 w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <div className="bg-white/20 backdrop-blur-xl rounded-xl px-4 sm:px-6 py-2 sm:py-3 border border-white/30 order-first sm:order-none">
                  <span className="text-white font-bold text-sm sm:text-base">
                    Image {currentImageIndex + 1} of {images.length}
                  </span>
                </div>

                <Button
                  onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex === images.length - 1}
                  variant="outline"
                  size="sm"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-xl disabled:opacity-50 w-full sm:w-auto"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Main Title - Same as single image */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-tighter drop-shadow-2xl"
            >
              Multi-Image Analysis
            </motion.h1>

            {/* Results Summary - Enhanced for multi-image */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl text-white font-medium drop-shadow-lg px-4"
            >
              Bulk breed identification and analysis
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-base sm:text-lg text-white font-medium drop-shadow-lg mt-2 px-4"
            >
              We found <span className="font-bold text-emerald-300">{validResults.length} potential breed matches</span> for your cattle/buffalo
              {images.length > 1 && (
                <span className="block mt-2 text-sm sm:text-base text-white/80">
                  ({stats.successful} of {stats.total} images analyzed successfully)
                </span>
              )}
            </motion.p>
          </div>
        </motion.div>

        {/* Main Content Grid - EXACT same as single image */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="container mx-auto px-4 sm:px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Left Column - Image - EXACT same as single image */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="lg:sticky lg:top-24">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                    className="bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/30 shadow-2xl"
                  >
                    <div className="relative rounded-2xl overflow-hidden mb-4">
                      <img 
                        src={currentImage.url} 
                        alt={`Analyzed cattle/buffalo ${currentImageIndex + 1}`} 
                        className="w-full h-64 sm:h-80 object-cover"
                      />
                      {/* Analysis indicator overlay */}
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-emerald-500/95 backdrop-blur-xl rounded-full px-2 sm:px-3 py-1 border border-emerald-400/60 shadow-lg">
                        <span className="text-white text-xs sm:text-sm font-semibold">Analyzed</span>
                      </div>
                      {/* Image counter for multi-image */}
                      {images.length > 1 && (
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/60 backdrop-blur-xl rounded-full px-2 sm:px-3 py-1 border border-white/30">
                          <span className="text-white text-xs sm:text-sm font-semibold">{currentImageIndex + 1}/{images.length}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Image metadata - EXACT same as single image */}
                    <div className="space-y-2 sm:space-y-3 text-sm">
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-900 font-semibold">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-700 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">Analyzed just now</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-900 font-semibold">
                        <Binoculars className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-700 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">Breed Confidence: High</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-900 font-semibold">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-700 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">BPA Integration Ready</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <Button 
                        onClick={downloadResults}
                        variant="default"
                        className="flex-1 shadow-lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Results
                      </Button>
                      {images.length === 1 && (
                        <Button 
                          onClick={onNewUpload}
                          variant="outline"
                          className="border-2 border-blue-600 text-blue-600 bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl px-4 py-2 font-medium transition-all duration-300"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          New Upload
                        </Button>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Right Column - Breed Results - Enhanced with standardized format */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                {/* Enhanced Analysis Summary for Multi-Image */}
                {summary && images.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="mb-6"
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-emerald-100/50 shadow-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-xl font-bold text-gray-800">Batch Analysis Summary</h2>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-700">{summary.totalImages}</div>
                          <div className="text-sm text-blue-600">Images</div>
                        </div>
                        
                        <div className="bg-emerald-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-emerald-700">{summary.successfulAnalyses}</div>
                          <div className="text-sm text-emerald-600">Success</div>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-purple-700">{summary.totalBreedsIdentified}</div>
                          <div className="text-sm text-purple-600">Breeds</div>
                        </div>
                        
                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-orange-700">
                            {summary.averageConfidence || 0}%
                          </div>
                          <div className="text-sm text-orange-600">Avg Confidence</div>
                        </div>
                      </div>
                      
                      {summary.mostCommonBreeds && summary.mostCommonBreeds.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">Most Common Breeds:</h3>
                          <div className="flex flex-wrap gap-2">
                            {summary.mostCommonBreeds.map((breed, index) => (
                              <span 
                                key={index}
                                className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md text-xs font-medium"
                              >
                                {breed}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4 sm:space-y-6">
                  {validResults.map((breed: SpeciesIdentification, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 + index * 0.2 }}
                      className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden hover:bg-white/98 hover:shadow-3xl transition-all duration-300"
                    >
                      {/* Enhanced Breed Header with BPA Integration Status */}
                      <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200/60">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 break-words">
                              {breed.commonName || breed.species}
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600 italic font-medium break-words">
                              {breed.species}
                            </p>
                          </div>
                          
                          {/* Confidence Badge */}
                          {breed.confidence && (
                            <div className="flex items-center gap-2 bg-emerald-500/90 backdrop-blur-xl rounded-full px-3 sm:px-4 py-2 border border-emerald-400/60 shadow-lg shrink-0">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              <span className="text-white font-bold text-sm sm:text-base">
                                {breed.confidence}% match
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* BPA Registration Status */}
                        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50/80 rounded-lg px-3 py-2">
                          <Shield className="w-4 h-4" />
                          <span className="font-medium">BPA Registration Ready - Indian Breed Verified</span>
                        </div>
                      </div>

                      {/* Enhanced Breed Details */}
                      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                        {/* Description */}
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3">Description</h3>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                            {breed.description}
                          </p>
                        </div>

                        {/* Habitat & Conservation in Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          {/* Habitat */}
                          <div>
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                              <h3 className="text-base sm:text-lg font-bold text-gray-800">Origin & Distribution</h3>
                            </div>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                              {breed.habitat}
                            </p>
                          </div>

                          {/* Conservation */}
                          <div>
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                              <h3 className="text-base sm:text-lg font-bold text-gray-800">Breed Status</h3>
                            </div>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                              {breed.conservation || 'Indigenous Indian breed suitable for BPA registration'}
                            </p>
                          </div>
                        </div>

                        {/* Enhanced Metadata Section - Using extracted characteristics from API response */}
                        {showEnhancedView && (
                          <div className="border-t border-gray-200/60 pt-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Analysis</h3>
                            
                            {(() => {
                              // Check if breed has standardized characteristics (new API format)
                              const hasStandardizedFormat = breed.breedCharacteristics && 
                                typeof breed.breedCharacteristics === 'object';
                              
                              const extractedChars = hasStandardizedFormat 
                                ? breed.breedCharacteristics
                                : extractBreedCharacteristicsFromDescription(breed);
                              
                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-blue-50/80 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm text-blue-800 mb-2">Body Structure</h4>
                                    <p className="text-sm text-blue-700">{extractedChars.bodyStructure}</p>
                                  </div>
                                  
                                  <div className="bg-green-50/80 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm text-green-800 mb-2">Color Pattern</h4>
                                    <p className="text-sm text-green-700">{extractedChars.colorPattern}</p>
                                  </div>
                                  
                                  <div className="bg-purple-50/80 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm text-purple-800 mb-2">Horn Characteristics</h4>
                                    <p className="text-sm text-purple-700">{extractedChars.hornCharacteristics}</p>
                                  </div>
                                  
                                  <div className="bg-orange-50/80 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm text-orange-800 mb-2">Overall Conformation</h4>
                                    <p className="text-sm text-orange-700">{extractedChars.overallConformation}</p>
                                  </div>
                                  
                                  <div className="bg-indigo-50/80 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm text-indigo-800 mb-2">Hump Presence</h4>
                                    <p className="text-sm text-indigo-700">{extractedChars.humpPresence}</p>
                                  </div>
                                  
                                  <div className="bg-emerald-50/80 rounded-lg p-4">
                                    <h4 className="font-semibold text-sm text-emerald-800 mb-2">BPA Registration Notes</h4>
                                    <p className="text-sm text-emerald-700">
                                      {breed.bpaRegistrationNotes || 'High-confidence identification recommended for BPA registration'}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            {/* Additional Analysis Insights */}
                            <div className="mt-6 pt-6 border-t border-gray-200/60">
                              <h4 className="text-base font-bold text-gray-800 mb-3">Analysis Insights</h4>
                              {(() => {
                                // Check if breed has standardized characteristics (new API format)
                                const hasStandardizedFormat = breed.breedCharacteristics && 
                                  typeof breed.breedCharacteristics === 'object';
                                
                                const extractedChars = hasStandardizedFormat 
                                  ? breed.breedCharacteristics
                                  : extractBreedCharacteristicsFromDescription(breed);
                                
                                const metadata = hasStandardizedFormat 
                                  ? breed.metadata || {}
                                  : extractBreedCharacteristicsFromDescription(breed);
                                
                                return (
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="bg-blue-50/80 rounded-lg p-3 text-center">
                                      <Calendar className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                                      <p className="text-xs font-semibold text-blue-800">Age Est.</p>
                                      <p className="text-xs text-blue-600">{metadata.estimatedAge || 'Not determined'}</p>
                                    </div>
                                    
                                    <div className="bg-green-50/80 rounded-lg p-3 text-center">
                                      <Eye className="w-4 h-4 text-green-600 mx-auto mb-1" />
                                      <p className="text-xs font-semibold text-green-800">Size</p>
                                      <p className="text-xs text-green-600">{metadata.estimatedSize || 'Not determined'}</p>
                                    </div>
                                    
                                    <div className="bg-purple-50/80 rounded-lg p-3 text-center">
                                      <Eye className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                                      <p className="text-xs font-semibold text-purple-800">Quality</p>
                                      <p className="text-xs text-purple-600">High</p>
                                    </div>
                                    
                                    <div className="bg-orange-50/80 rounded-lg p-3 text-center">
                                      <Shield className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                                      <p className="text-xs font-semibold text-orange-800">BPA Status</p>
                                      <p className="text-xs text-orange-600">
                                        {breed.confidence && breed.confidence >= 85 ? 'Ready' : 'Review'}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom navigation for multiple images */}
        {images.length > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="container mx-auto px-4 sm:px-6 mt-8 sm:mt-12"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white/20 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-white/30">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
                  <Button 
                    onClick={onNewUpload}
                    variant="default"
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Analyze New Images
                  </Button>
                  <span className="text-white font-medium text-sm sm:text-base">
                    Analyzed {stats.successful} of {stats.total} images
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
});

MultiImageResultsUnified.displayName = 'MultiImageResultsUnified';

export default MultiImageResultsUnified;
