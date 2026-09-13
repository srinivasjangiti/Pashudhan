import React, { useState, memo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { X, Upload, ImageIcon, Brain, Zap, Search, Plus, ArrowRight, Check, Images } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { identifyMultipleSpecies, MultiImageAnalysisResult, BatchAnalysisResult } from '@/services/multiImageGeminiApi';
import { LiquidGlassUploadDemo } from '@/components/ui/liquid-glass-upload-demo';
import { WebGLShader } from '@/components/ui/web-gl-shader';
import { SharedLayout } from '@/components/SharedLayout';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';
import uploadBg from '@/assets/upload_bg.png';
import MultiImageResultsUnified from '@/components/MultiImageResults';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  status: 'pending' | 'uploading' | 'analyzing' | 'complete' | 'error';
  progress?: number;
  results?: MultiImageAnalysisResult;
  error?: string;
}

interface UploadUltimateProps {
  onShowResults?: (images: UploadedImage[]) => void;
}

// Premium single image analyzing container with full-screen integration
const SingleImageAnalyzingContainer = memo(({ image }: { image: UploadedImage }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="w-full max-w-4xl mx-auto space-y-8"
  >
    {/* Hero image with subtle, elegant analysis overlay */}
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative group"
    >
      <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        <img 
          src={image.url} 
          alt="Your cattle/buffalo image" 
          className="w-full h-96 object-cover transition-all duration-700 group-hover:scale-105"
        />
        
        {/* Elegant scanning animation - barely noticeable but premium */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 2
          }}
        />
        
        {/* Minimal AI indicator */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/30 backdrop-blur-xl rounded-full px-5 py-3 border border-white/20">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-emerald-400 rounded-full"
          />
          <span className="text-white text-sm font-medium">AI analyzing breed</span>
        </div>
      </div>
    </motion.div>

    {/* Clean, minimal status section */}
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="text-center space-y-6"
    >
      {/* Simple, elegant title */}
      <div>
        <h2 className="text-4xl font-semibold text-white mb-4 drop-shadow-2xl">
          Identifying cattle/buffalo breed
        </h2>
        <p className="text-white/90 text-xl font-medium drop-shadow-lg">
          Analyzing breed characteristics for BPA registration
        </p>
      </div>

      {/* Minimal progress bar */}
      <div className="w-full max-w-md mx-auto">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: image.progress ? `${image.progress}%` : ["0%", "70%", "90%"] }}
            transition={{ 
              duration: image.progress ? 0.5 : 8,
              times: image.progress ? undefined : [0, 0.7, 1],
              ease: "easeOut"
            }}
          />
        </div>
      </div>

      {/* Subtle process steps - very clean */}
      <div className="flex justify-center items-center space-x-8 opacity-90">
        <motion.div 
          className="flex items-center space-x-2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg"></div>
          <span className="text-white/85 text-sm font-medium drop-shadow-lg">scanning</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg"></div>
          <span className="text-white/85 text-sm font-medium drop-shadow-lg">processing</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-2"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
        >
          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-lg"></div>
          <span className="text-white/85 text-sm font-medium drop-shadow-lg">identifying</span>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
));

SingleImageAnalyzingContainer.displayName = 'SingleImageAnalyzingContainer';

// Individual image upload card with elegant animations
const ImageUploadCard = memo(({ image, onRemove }: { 
  image: UploadedImage; 
  onRemove: (id: string) => void;
}) => {
  const getStatusIcon = () => {
    const iconClass = "w-3 h-3 sm:w-4 sm:h-4";
    switch (image.status) {
      case 'pending':
        return <Upload className={`${iconClass} text-blue-400`} />;
      case 'uploading':
        return <Upload className={`${iconClass} text-yellow-400 animate-pulse`} />;
      case 'analyzing':
        return <Brain className={`${iconClass} text-purple-400 animate-spin`} />;
      case 'complete':
        return <Check className={`${iconClass} text-emerald-400`} />;
      case 'error':
        return <X className={`${iconClass} text-red-400`} />;
      default:
        return <Upload className={`${iconClass} text-gray-400`} />;
    }
  };

  const getStatusColor = () => {
    switch (image.status) {
      case 'pending':
        return 'border-blue-400/50 bg-blue-400/10';
      case 'uploading':
        return 'border-yellow-400/50 bg-yellow-400/10';
      case 'analyzing':
        return 'border-purple-400/50 bg-purple-400/10';
      case 'complete':
        return 'border-emerald-400/50 bg-emerald-400/10';
      case 'error':
        return 'border-red-400/50 bg-red-400/10';
      default:
        return 'border-gray-400/50 bg-gray-400/10';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "relative group rounded-2xl overflow-hidden backdrop-blur-xl border-2 transition-all duration-300",
        getStatusColor()
      )}
    >
      {/* Image */}
      <div className="aspect-square w-full">
        <img 
          src={image.url} 
          alt={`Upload ${image.id}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay with status */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20">
          {/* Status indicator */}
          <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-black/40 backdrop-blur-md">
            {getStatusIcon()}
            <span className="text-xs font-medium text-white capitalize hidden sm:inline">
              {image.status}
            </span>
          </div>
          
          {/* Remove button */}
          <button
            onClick={() => onRemove(image.id)}
            className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 p-1 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white hover:bg-red-500/60 transition-all duration-200"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
        
        {/* Progress bar for uploading/analyzing */}
        {(image.status === 'uploading' || image.status === 'analyzing') && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ 
                width: image.progress ? `${image.progress}%` : ['0%', '70%', '90%']
              }}
              transition={{ 
                duration: image.progress ? 0.5 : 3,
                repeat: image.progress ? 0 : Infinity,
                ease: "easeOut"
              }}
            />
          </div>
        )}
      </div>
      
      {/* File name */}
      <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-6 sm:right-8">
        <p className="text-xs text-white/90 font-medium truncate bg-black/40 backdrop-blur-md px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hidden sm:block">
          {image.file.name}
        </p>
      </div>
    </motion.div>
  );
});

ImageUploadCard.displayName = 'ImageUploadCard';

// Main component
const UploadUltimate = memo<UploadUltimateProps>(({ onShowResults }) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [batchSummary, setBatchSummary] = useState<BatchAnalysisResult['summary'] | null>(null);
  const { state, setLoading } = useAppContext();
  const { toast } = useToast();
  
  const isProcessing = uploadedImages.some(img => 
    img.status === 'uploading' || img.status === 'analyzing'
  );
  const completedImages = uploadedImages.filter(img => img.status === 'complete');
  const hasErrors = uploadedImages.some(img => img.status === 'error');
  const isSingleImage = uploadedImages.length === 1;
  const isAnalyzing = isProcessing && uploadedImages.length > 0;

  // File selection handler with advanced validation
  const handleFilesSelect = useCallback(async (files: File[]) => {
    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    files.forEach((file, index) => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors.push(`File ${index + 1}: "${file.name}" is not an image file`);
        return;
      }
      
      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        errors.push(`File ${index + 1}: "${file.name}" is too large (max 10MB)`);
        return;
      }
      
      validFiles.push(file);
    });
    
    // Show errors if any
    if (errors.length > 0) {
      toast({
        title: "Some files were rejected",
        description: errors.slice(0, 3).join('. ') + (errors.length > 3 ? `... and ${errors.length - 3} more.` : ''),
        variant: "destructive",
      });
    }
    
    // Check total limit (max 10 images including existing)
    const totalImages = uploadedImages.length + validFiles.length;
    if (totalImages > 10) {
      const allowedCount = Math.max(0, 10 - uploadedImages.length);
      toast({
        title: "Too many images",
        description: `Maximum 10 images allowed. Only first ${allowedCount} images will be processed.`,
        variant: "destructive",
      });
      validFiles.splice(allowedCount);
    }
    
    if (validFiles.length === 0) return;
    
    // Create uploaded image objects
    const newImages: UploadedImage[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      url: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
    
    // Auto-start analysis for single image uploads
    if (newImages.length === 1 && uploadedImages.length === 0) {
      setTimeout(() => handleStartAnalysis([...uploadedImages, ...newImages]), 500);
    } else {
      toast({
        title: "Images Added",
        description: `${validFiles.length} image${validFiles.length === 1 ? '' : 's'} ready for analysis.`,
      });
    }
  }, [uploadedImages.length, toast]);

  // Remove image handler
  const handleRemoveImage = useCallback((id: string) => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  // Start analysis for all pending images
  const handleStartAnalysis = useCallback(async (imagesToAnalyze?: UploadedImage[]) => {
    const targetImages = imagesToAnalyze || uploadedImages;
    const pendingImages = targetImages.filter(img => img.status === 'pending');
    if (pendingImages.length === 0) return;
    
    setLoading(true);
    
    // Update all pending images to analyzing status
    setUploadedImages(prev => 
      prev.map(img => 
        img.status === 'pending' 
          ? { ...img, status: 'analyzing' as const, progress: 0 }
          : img
      )
    );
    
    try {
      // Use the robust multi-image API for everything
      const files = pendingImages.map(img => img.file);
      const batchResult = await identifyMultipleSpecies(files, (progress, message) => {
        // Update progress for all analyzing images
        setUploadedImages(prev => 
          prev.map(img => 
            img.status === 'analyzing' 
              ? { ...img, progress }
              : img
          )
        );
      });
      
      // Update results for each image
      setUploadedImages(prev => 
        prev.map(img => {
          if (img.status === 'analyzing') {
            const result = batchResult.results.find(r => r.fileName === img.file.name);
            if (result) {
              if (result.error) {
                return { ...img, status: 'error' as const, error: result.error, progress: 100 };
              } else {
                return { 
                  ...img, 
                  status: 'complete' as const, 
                  progress: 100,
                  results: result
                };
              }
            }
          }
          return img;
        })
      );
      
      if (batchResult.success) {
        // Store the enhanced summary for the results component
        setBatchSummary(batchResult.summary);
        
        const successCount = batchResult.summary.successfulAnalyses;
        const totalCount = batchResult.summary.totalImages;
        
        toast({
          title: "Analysis Complete!",
          description: successCount === 1 && totalCount === 1 
            ? "Successfully identified potential breed matches in your image."
            : `Successfully analyzed ${successCount} of ${totalCount} images. Found ${batchResult.summary.totalBreedsIdentified} breed matches.`,
        });
        
        // Auto-navigate to results for single image
        if (pendingImages.length === 1 && uploadedImages.length === 1) {
          setTimeout(() => handleViewResults(), 1000);
        }
      } else {
        setBatchSummary(null);
        toast({
          title: "Analysis Failed",
          description: batchResult.error || "Some images could not be analyzed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      
      // Mark all analyzing images as error
      setUploadedImages(prev => 
        prev.map(img => 
          img.status === 'analyzing' 
            ? { ...img, status: 'error' as const, error: error instanceof Error ? error.message : 'Analysis failed' }
            : img
        )
      );
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred during analysis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [uploadedImages, setLoading, toast]);

  // Drag handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFilesSelect(files);
    }
  }, [handleFilesSelect]);

  // View results handler
  const handleViewResults = useCallback(() => {
    if (onShowResults) {
      onShowResults(uploadedImages);
    } else {
      setShowResults(true);
    }
  }, [uploadedImages, onShowResults]);

  // Reset handler
  const handleReset = useCallback(() => {
    // Clean up object URLs
    uploadedImages.forEach(img => URL.revokeObjectURL(img.url));
    setUploadedImages([]);
    setShowResults(false);
    setBatchSummary(null);
    setLoading(false);
  }, [uploadedImages, setLoading]);

  // Handle input file selection
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFilesSelect(files);
    }
  }, [handleFilesSelect]);

  return (
    <>
      <SignedIn>
        {showResults ? (
          <MultiImageResultsUnified 
            images={uploadedImages} 
            onNewUpload={handleReset}
            summary={batchSummary || undefined}
            showEnhancedView={true}
          />
        ) : (
          <SharedLayout background="upload">
            <div className="min-h-screen relative overflow-hidden">
              {/* WebGL Wave Shader Background */}
              <div className="absolute inset-0 z-0">
                <WebGLShader />
                <div className={`absolute inset-0 transition-all duration-500 ${
                  isAnalyzing ? 'bg-black/30' : 'bg-black/10'
                }`}></div>
              </div>

              {/* Static Cattle/Buffalo Background Image */}
              <div 
                className={`absolute inset-0 z-1 bg-cover bg-center bg-no-repeat transition-all duration-500 ${
                  isAnalyzing ? 'opacity-85' : 'opacity-95'
                }`}
                style={{
                  backgroundImage: `url(${uploadBg})`,
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
                <div className={`absolute inset-0 transition-all duration-500 ${
                  isAnalyzing ? 'bg-black/25' : 'bg-black/10'
                }`}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 via-purple-800/5 to-blue-900/5"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 min-h-screen">
                {/* Main Content */}
                <div 
                  className="container mx-auto px-4 sm:px-6 min-h-screen flex items-center justify-center py-8"
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {/* Dynamic content based on state */}
                  {uploadedImages.length === 0 ? (
                    /* No images uploaded - Show upload UI */
                    <div className="w-full max-w-4xl mx-auto">
                      {/* Header */}
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-6 sm:mb-8 px-4"
                      >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-2xl mb-3 sm:mb-4">
                          Cattle & Buffalo Breed Analysis
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 drop-shadow-lg max-w-2xl mx-auto">
                          Upload single or multiple images for AI-powered breed identification
                        </p>
                      </motion.div>

                      {/* Upload Component */}
                      <div className="flex items-center justify-center">
                        <LiquidGlassUploadDemo 
                          onFileSelect={(file) => handleFilesSelect([file])}
                          onFilesSelect={handleFilesSelect}
                          isDragActive={isDragActive}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          className="w-full"
                          multiple={true}
                        />
                      </div>
                    </div>
                  ) : isSingleImage && isAnalyzing ? (
                    /* Single image analyzing */
                    <SingleImageAnalyzingContainer image={uploadedImages[0]} />
                  ) : (
                    /* Multiple images or completed single image */
                    <div className="w-full space-y-6 sm:space-y-8">
                      {/* Header */}
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-6 sm:mb-8 px-4"
                      >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-2xl mb-3 sm:mb-4">
                          {isSingleImage ? "Breed Analysis" : "Multi-Image Analysis"}
                        </h1>
                        <p className="text-lg sm:text-xl text-white/90 drop-shadow-lg max-w-2xl mx-auto">
                          {isSingleImage 
                            ? "AI-powered breed identification for your cattle/buffalo"
                            : "Bulk breed identification and analysis"
                          }
                        </p>
                      </motion.div>

                      {/* Action Bar */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/20"
                      >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                            <span className="text-white font-medium text-sm sm:text-base">
                              {uploadedImages.length} image{uploadedImages.length === 1 ? '' : 's'} uploaded
                            </span>
                            {completedImages.length > 0 && (
                              <span className="text-emerald-400 font-medium text-sm sm:text-base">
                                {completedImages.length} analyzed
                              </span>
                            )}
                            {hasErrors && (
                              <span className="text-red-400 font-medium text-sm sm:text-base">
                                {uploadedImages.filter(img => img.status === 'error').length} failed
                              </span>
                            )}
                          </div>
                        
                          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                            {/* Add More Images Button */}
                            {!isSingleImage && (
                              <label>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleFileInput}
                                  className="sr-only"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="text-xs sm:text-sm"
                                >
                                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                  Add More
                                </Button>
                              </label>
                            )}
                            
                            {/* Start Analysis Button */}
                            {uploadedImages.some(img => img.status === 'pending') && (
                              <Button
                                onClick={() => handleStartAnalysis()}
                                disabled={isProcessing}
                                size="sm"
                                variant="default"
                                className="text-xs sm:text-sm"
                              >
                                <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                Start Analysis
                              </Button>
                            )}
                            
                            {/* View Results Button */}
                            {completedImages.length > 0 && (
                              <Button
                                onClick={handleViewResults}
                                size="sm"
                                variant="purple"
                                className="text-xs sm:text-sm"
                              >
                                <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                View Results
                                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                              </Button>
                            )}

                            {/* Reset Button */}
                            <Button
                              onClick={handleReset}
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm"
                            >
                              Start Over
                            </Button>
                          </div>
                        </div>
                      </motion.div>

                      {/* Images Display */}
                      {isSingleImage ? (
                        /* Single image card - larger display */
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex justify-center"
                        >
                          <div className="w-full max-w-md">
                            <ImageUploadCard
                              image={uploadedImages[0]}
                              onRemove={handleRemoveImage}
                            />
                          </div>
                        </motion.div>
                      ) : (
                        /* Multiple images grid */
                        <motion.div
                          layout
                          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4"
                        >
                          <AnimatePresence>
                            {uploadedImages.map((image) => (
                              <ImageUploadCard
                                key={image.id}
                                image={image}
                                onRemove={handleRemoveImage}
                              />
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SharedLayout>
        )}
      </SignedIn>
      
      <SignedOut>
        <SharedLayout background="upload">
          <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
            {/* WebGL Wave Shader Background */}
            <div className="absolute inset-0 z-0">
              <WebGLShader />
              <div className="absolute inset-0 bg-black/70"></div>
            </div>

            {/* Static Cattle/Buffalo Background Image */}
            <div 
              className="absolute inset-0 z-1 bg-cover bg-center bg-no-repeat opacity-60"
              style={{
                backgroundImage: `url(${uploadBg})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/60"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/15 via-transparent to-emerald-900/15"></div>
            </div>

            {/* Authentication Required Message */}
            <div className="relative z-10 text-center space-y-8 max-w-lg mx-auto px-6">
              <div className="bg-black/40 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="p-4 bg-emerald-500/30 backdrop-blur-sm rounded-full w-fit mx-auto border-2 border-emerald-400/50 shadow-lg">
                    <Search className="w-10 h-10 text-emerald-300 drop-shadow-lg" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white drop-shadow-2xl shadow-black/80">
                    Sign in to Analyze Cattle & Buffalo Breeds
                  </h2>
                  
                  <p className="text-lg text-white/90 drop-shadow-lg leading-relaxed font-medium">
                    Please sign in to upload and identify breeds in your cattle/buffalo images for BPA registration.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <SignInButton mode="modal">
                    <button className="px-8 py-4 text-base font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 backdrop-blur-sm border border-emerald-500/50 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-8 py-4 text-base font-semibold text-white border-2 border-white/40 rounded-xl hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </div>
          </div>
        </SharedLayout>
      </SignedOut>
    </>
  );
});

UploadUltimate.displayName = 'UploadUltimate';

export default UploadUltimate;
