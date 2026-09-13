import React, { useState, useEffect } from 'react';
import { SpeciesResults } from '@/components/SpeciesResults';
import { SpeciesIdentification } from '@/services/geminiApi';
import { SharedLayout } from '@/components/SharedLayout';
import { ArrowLeft, ChevronRight, Star, MapPin, Info, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { extractBreedCharacteristicsFromDescription } from '@/utils/breedCharacteristicsExtractor';

interface ResultsProps {
  imageUrl: string;
  results: SpeciesIdentification[];
  onBack?: () => void;
  onNewUpload: () => void;
  onHome?: () => void;
  imageFile?: File;
  processingTime?: number;
}

const Results: React.FC<ResultsProps> = ({ 
  imageUrl, 
  results, 
  onNewUpload,
  onBack,
  imageFile,
  processingTime
}) => {
  // Validate props to handle edge cases
  if (!imageUrl || !results || results.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Info className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-[28px] font-semibold text-black mb-3 tracking-tight">No Results Available</h2>
          <p className="text-[17px] text-gray-600 mb-8 leading-relaxed">There are no breed identification results to display.</p>
          <Button 
            onClick={onNewUpload}
            variant="default"
            className="px-8 py-3 rounded-full text-[17px] font-medium transition-all duration-200"
          >
            Upload New Image
          </Button>
        </div>
      </div>
    );
  }

  // Filter out any invalid results
  const validResults = results.filter(result => 
    result.species && 
    !result.error && 
    result.species.trim() !== ''
  );

  if (validResults.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Info className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-[28px] font-semibold text-black mb-3 tracking-tight">No Valid Breeds Identified</h2>
          <p className="text-[17px] text-gray-600 mb-8 leading-relaxed">Unable to identify any valid Indian cattle or buffalo breeds in the uploaded image.</p>
          <Button 
            onClick={onNewUpload}
            variant="default"
            className="px-8 py-3 rounded-full text-[17px] font-medium transition-all duration-200"
          >
            Try Another Image
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header - Apple Style */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors duration-150 -ml-1 px-1 py-1 rounded-md hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-normal text-[17px]">Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-[17px] font-semibold text-black tracking-tight">Breed Analysis</h1>
            </div>
            <Button 
              onClick={onNewUpload}
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-1.5 rounded-lg text-[15px] font-medium transition-all duration-150 shadow-sm"
            >
              New Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Image Column */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-black/5"
              >
                <div className="aspect-square relative">
                  <img 
                    src={imageUrl} 
                    alt="Analyzed livestock" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Info */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[17px] font-medium text-black">Analysis Complete</h3>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-2.5 text-[15px]">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Breeds Found</span>
                      <span className="font-medium text-black">{validResults.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Confidence</span>
                      <span className="font-medium text-black">High</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {/* Results Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mb-6"
              >
                <h2 className="text-[28px] font-semibold text-black mb-1 tracking-tight">
                  Identified Breeds
                </h2>
                <p className="text-[17px] text-gray-600">
                  We found {validResults.length} potential breed matches for your livestock
                </p>
              </motion.div>

              {/* Breed Results */}
              {validResults.map((breed, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-white rounded-[20px] border border-black/5 overflow-hidden hover:shadow-lg transition-all duration-300 ease-out"
                >
                  {/* Breed Header */}
                  <div className="p-6 border-b border-black/5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-[22px] font-semibold text-black mb-1 tracking-tight">
                          {breed.commonName || breed.species}
                        </h3>
                        <p className="text-[17px] text-gray-600 italic">
                          {breed.species}
                        </p>
                      </div>
                      
                      {/* Confidence Badge */}
                      {breed.confidence && (
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                          <Star className="w-3.5 h-3.5 text-gray-600" />
                          <span className="text-[15px] font-medium text-black">
                            {breed.confidence}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Breed Content */}
                  <div className="p-6 space-y-5">
                    {/* Description */}
                    <div>
                      <h4 className="text-[17px] font-medium text-black mb-3">Description</h4>
                      <p className="text-[15px] text-gray-600 leading-relaxed">
                        {breed.description}
                      </p>
                    </div>

                    {/* Key Characteristics */}
                    {(() => {
                      const characteristics = extractBreedCharacteristicsFromDescription(breed);
                      const hasCharacteristics = characteristics.colorPattern || 
                                                characteristics.bodyStructure || 
                                                characteristics.hornCharacteristics ||
                                                characteristics.facialFeatures ||
                                                characteristics.humpPresence;
                      
                      if (!hasCharacteristics) return null;

                      return (
                        <div>
                          <h4 className="text-[17px] font-medium text-black mb-3">Key Characteristics</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {characteristics.colorPattern && (
                              <div className="bg-gray-50 rounded-lg p-3.5">
                                <div className="text-[15px] font-medium text-black mb-1">Color Pattern</div>
                                <div className="text-[14px] text-gray-600">{characteristics.colorPattern}</div>
                              </div>
                            )}
                            
                            {characteristics.bodyStructure && (
                              <div className="bg-gray-50 rounded-lg p-3.5">
                                <div className="text-[15px] font-medium text-black mb-1">Body Structure</div>
                                <div className="text-[14px] text-gray-600">{characteristics.bodyStructure}</div>
                              </div>
                            )}
                            
                            {characteristics.hornCharacteristics && (
                              <div className="bg-gray-50 rounded-lg p-3.5">
                                <div className="text-[15px] font-medium text-black mb-1">Horn Features</div>
                                <div className="text-[14px] text-gray-600">{characteristics.hornCharacteristics}</div>
                              </div>
                            )}
                            
                            {characteristics.humpPresence && (
                              <div className="bg-gray-50 rounded-lg p-3.5">
                                <div className="text-[15px] font-medium text-black mb-1">Hump Features</div>
                                <div className="text-[14px] text-gray-600">{characteristics.humpPresence}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Additional Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Origin */}
                      {breed.habitat && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <h4 className="text-[17px] font-medium text-black">Origin & Distribution</h4>
                          </div>
                          <p className="text-[15px] text-gray-600 leading-relaxed">
                            {breed.habitat}
                          </p>
                        </div>
                      )}

                      {/* Conservation Status */}
                      {breed.conservation && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-gray-600" />
                            <h4 className="text-[17px] font-medium text-black">Breed Status</h4>
                          </div>
                          <p className="text-[15px] text-gray-600 leading-relaxed">
                            {breed.conservation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
