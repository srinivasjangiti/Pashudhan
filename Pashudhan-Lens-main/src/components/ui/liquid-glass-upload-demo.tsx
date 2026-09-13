"use client"

import React, { useCallback, useState } from 'react'
import { Upload, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { materialShadows, materialTransitions, materialCards } from '@/lib/material'

interface LiquidGlassUploadDemoProps {
  onFileSelect: (file: File) => void
  onFilesSelect?: (files: File[]) => void // New prop for multiple files
  className?: string
  isDragActive?: boolean
  multiple?: boolean // New prop to enable multiple file selection
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
}

function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          {/* Generate turbulent noise for distortion */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.03"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />

          {/* Blur the turbulence pattern slightly - Reduced for sharpness */}
          <feGaussianBlur in="turbulence" stdDeviation="1" result="blurredNoise" />

          {/* Displace the source graphic with the noise - reduced intensity */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />

          {/* Apply overall blur on the final result - Minimal blur for quality */}
          <feGaussianBlur in="displaced" stdDeviation="0.5" result="finalBlur" />

          {/* Output the result */}
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

export function LiquidGlassUploadDemo({
  onFileSelect,
  onFilesSelect,
  className,
  isDragActive = false,
  multiple = false,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragOver,
}: LiquidGlassUploadDemoProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (multiple && files.length > 0) {
      // Handle multiple files
      const validFiles = files.filter(file => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        return validTypes.includes(file.type.toLowerCase()) && file.size <= maxSize;
      });
      
      if (validFiles.length > 0 && onFilesSelect) {
        onFilesSelect(validFiles);
      }
    } else {
      // Handle single file (existing logic)
      const file = files[0];
      if (file) {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
        if (!validTypes.includes(file.type.toLowerCase())) {
          e.target.value = '';
          return;
        }
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          e.target.value = '';
          return;
        }
        
        onFileSelect(file);
      }
    }
    
    // Reset input
    e.target.value = '';
  }, [onFileSelect, onFilesSelect, multiple])

  return (
    <>
      {/* EXACT Demo Structure */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div 
          className={cn(
            `relative border-2 p-3 w-full mx-auto max-w-3xl cursor-pointer rounded-2xl transition-all duration-300`,
            isDragActive || isHovered 
              ? `border-emerald-400/60 shadow-[0_10px_20px_rgba(16,185,129,0.3)]` 
              : `border-emerald-300/40 shadow-[0_3px_6px_rgba(16,185,129,0.16)]`,
            `hover:shadow-[0_6px_16px_rgba(16,185,129,0.23)] hover:border-emerald-400/50`,
            className
          )}
          onDragEnter={(e) => onDragEnter?.(e)}
          onDragLeave={(e) => onDragLeave?.(e)}
          onDrop={(e) => onDrop?.(e)}
          onDragOver={(e) => onDragOver?.(e)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <main className="relative border-2 border-emerald-200/30 py-12 px-8 overflow-hidden rounded-xl bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300">
            
            {/* EXACT Liquid Glass Background */}
            <div 
              className="absolute top-0 left-0 z-0 h-full w-full rounded-full 
              shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
              transition-all 
              dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" 
            />
            
            <div
              className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md"
              style={{ backdropFilter: 'url("#container-glass")' }}
            />

            {/* Subtle overlay to reduce wave intensity and maintain clean glass look */}
            <div className="absolute top-0 left-0 h-full w-full bg-black/10 rounded-md -z-5" />

            {/* EXACT Content Layout */}
            <div className="relative z-10">
              {/* Upload Icon with better visibility */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative group-hover:scale-110 transition-all duration-500 bg-emerald-100/90 border border-emerald-200/50 shadow-lg">
                  <Upload className="w-8 h-8 text-emerald-600" />
                </div>
              </div>

              {/* Title with better visibility */}
              <h1 className="mb-3 text-gray-800 text-center text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter leading-tight">
                {multiple ? "Upload Cattle/Buffalo Photos" : "Upload Cattle/Buffalo Photo"}
              </h1>
              
              {/* Description with better visibility */}
              <p className="text-gray-700 px-6 text-center text-sm md:text-base font-medium">
                {multiple 
                  ? "Drag and drop multiple images of cattle or buffalo, or click to browse. Our AI will identify breeds for BPA registration."
                  : "Drag and drop an image of cattle or buffalo, or click to browse. Our AI will identify the breed for BPA registration."
                }
              </p>
              
              {/* Material Design Status Indicator */}
              <div className="my-6 flex items-center justify-center gap-2">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <p className="text-xs text-emerald-600 font-semibold">AI Ready for Breed Analysis</p>
              </div>
              
              {/* Enhanced Material Design Upload Button */}
              <div className="flex justify-center"> 
                <label className="relative inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-emerald-500/50 focus-visible:ring-[3px] hover:scale-105 text-white h-12 px-8 shadow-lg hover:shadow-xl">
                  
                  {/* Enhanced Material Design Button Background */}
                  <div className="absolute top-0 left-0 z-0 h-full w-full rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 transition-all duration-300 border border-emerald-400/30" />
                  
                  {/* Enhanced Material shine overlay */}
                  <div className="absolute top-0 left-0 h-full w-full rounded-xl bg-gradient-to-b from-white/20 via-transparent to-transparent pointer-events-none" />

                  <div className="pointer-events-none z-10 text-white font-semibold drop-shadow-sm">
                    {multiple ? "Choose Images" : "Choose Image"}
                  </div>
                  
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif"
                    multiple={multiple}
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                </label>
              </div>
              
              {/* File Support with better visibility */}
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-xs font-medium">
                  Supports PNG, JPG, WEBP, HEIC • Max 10MB • Indian Cattle & Buffalo Only
                </p>
              </div>
            </div>

            {/* EXACT Hover Effect */}
            {(isHovered || isDragActive) && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t rounded-lg from-transparent to-white/10 border-2 border-white/40" />
            )}
            
            {/* Drag Active Overlay with better visibility */}
            {isDragActive && (
              <div className="absolute inset-0 bg-emerald-500/10 border-4 border-emerald-400/70 border-dashed rounded-lg flex items-center justify-center z-20 shadow-[0_0_40px_rgba(16,185,129,0.6)]">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-emerald-600 mx-auto mb-2 drop-shadow-lg" />
                  <p className="text-emerald-700 font-semibold drop-shadow-lg">
                    {multiple ? "Drop your cattle/buffalo images here" : "Drop your cattle/buffalo image here"}
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <GlassFilter />
    </>
  )
}
