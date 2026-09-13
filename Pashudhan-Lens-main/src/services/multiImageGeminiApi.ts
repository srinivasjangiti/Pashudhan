// Optimized Multi-image Gemini API service for cattle and buffalo breed identification
// Standardized for BPA (Bharat Pashudhan App) integration
import { 
  StandardizedBreedIdentification, 
  MultiImageBreedResult,
  BatchBreedAnalysisResult,
  INDIAN_CATTLE_BREEDS,
  INDIAN_BUFFALO_BREEDS,
  isValidBreedIdentification,
  extractBreedMetadata
} from '@/types/breedIdentification';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDG-8mGxE2EUbI4Z5UVHI0Yyz2WtVVPbUs';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Legacy interfaces for backward compatibility  
export interface SpeciesIdentification {
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

export interface MultiImageAnalysisResult {
  image_index: number;
  fileName?: string;
  breeds: SpeciesIdentification[]; // Changed from 'results' to 'breeds' to match UI expectations
  error?: string;
}

export interface BatchAnalysisResult {
  success: boolean;
  results: MultiImageAnalysisResult[];
  summary: {
    totalImages: number;
    successfulAnalyses: number;
    failedAnalyses: number;
    totalBreedsIdentified: number;
    processingTime: number;
    averageConfidence: number;
    mostCommonBreeds: string[];
  };
  error?: string;
}

// Optimized image processing for multi-image scenarios
export const processMultipleImages = async (files: File[]): Promise<Array<{ base64: string; mimeType: string; fileName: string }>> => {
  const maxConcurrent = 3; // Process max 3 images simultaneously to avoid memory issues
  const results: Array<{ base64: string; mimeType: string; fileName: string }> = [];
  
  for (let i = 0; i < files.length; i += maxConcurrent) {
    const batch = files.slice(i, i + maxConcurrent);
    const batchPromises = batch.map(async (file) => {
      return new Promise<{ base64: string; mimeType: string; fileName: string }>((resolve, reject) => {
        try {
          const maxSize = 800 * 1024; // 800KB target size for multi-image to stay under API limits
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error(`Canvas context not available for ${file.name}`));
            return;
          }

          const img = new Image();

          img.onload = () => {
            try {
              // Validate image dimensions
              if (img.width < 50 || img.height < 50) {
                reject(new Error(`Image ${file.name} is too small. Please upload an image that is at least 50x50 pixels.`));
                return;
              }

              // Calculate optimal dimensions - more aggressive compression for multi-image
              const maxDimension = 768; // Smaller max dimension for multi-image
              let { width, height } = img;
              
              if (width > height) {
                if (width > maxDimension) {
                  height = (height * maxDimension) / width;
                  width = maxDimension;
                }
              } else {
                if (height > maxDimension) {
                  width = (width * maxDimension) / height;
                  height = maxDimension;
                }
              }

              canvas.width = width;
              canvas.height = height;

              // Draw and compress
              ctx.drawImage(img, 0, 0, width, height);
              
              // Start with moderate quality for multi-image
              let quality = 0.7;
              let result = canvas.toDataURL('image/jpeg', quality);
              
              // Reduce quality until under size limit
              while (result.length > maxSize && quality > 0.1) {
                quality -= 0.1;
                result = canvas.toDataURL('image/jpeg', quality);
              }

              // Check if we could compress sufficiently
              if (result.length > maxSize) {
                reject(new Error(`Unable to compress ${file.name} to acceptable size for multi-image processing.`));
                return;
              }

              const base64 = result.split(',')[1];
              if (!base64) {
                reject(new Error(`Failed to process image data for ${file.name}.`));
                return;
              }

              resolve({
                base64,
                mimeType: 'image/jpeg',
                fileName: file.name
              });
            } catch (error) {
              reject(new Error(`Error processing ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`));
            }
          };

          img.onerror = () => {
            reject(new Error(`Failed to load image: ${file.name}. Please ensure it's a valid image file.`));
          };

          // Create object URL and load image
          const objectUrl = URL.createObjectURL(file);
          img.src = objectUrl;
          
          // Clean up object URL after a delay
          setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        } catch (error) {
          reject(new Error(`Error setting up processing for ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });
    });
    
    try {
      const batchResults = await Promise.allSettled(batchPromises);
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`Failed to process image in batch ${i + index}:`, result.reason);
          throw new Error(result.reason.message || `Failed to process image ${batch[index].name}`);
        }
      });
    } catch (error) {
      throw error;
    }
  }
  
  return results;
};

// Enhanced prompt for multi-image analysis with standardized format
const createMultiImagePrompt = (imageCount: number): string => {
  return `You are an expert veterinarian and animal breed specialist with extensive knowledge of Indian cattle and buffalo breeds. You are analyzing ${imageCount} image${imageCount === 1 ? '' : 's'} for breed identification to support the Bharat Pashudhan App (BPA) registration system.

ANALYSIS REQUIREMENTS:
1. Analyze each image separately and independently
2. Only identify INDIAN cattle and buffalo breeds (no foreign breeds)
3. Focus on breed characteristics like body structure, color patterns, ear shape, horn structure, and facial features
4. Provide confidence scores as whole numbers (0-100)
5. Return results in the exact JSON format specified below

INDIAN CATTLE BREEDS TO CONSIDER:
${INDIAN_CATTLE_BREEDS.join(', ')}

INDIAN BUFFALO BREEDS TO CONSIDER:
${INDIAN_BUFFALO_BREEDS.join(', ')}

KEY BREED IDENTIFICATION FEATURES TO ANALYZE:
- Body size and structure (compact, large, medium)
- Color patterns (solid, patches, distinctive markings)
- Horn characteristics (size, shape, orientation)
- Ear shape and size
- Facial features and head shape
- Hump presence and size (for cattle)
- Overall conformation

RESPONSE FORMAT - Return a JSON array where each object represents one image:
[
  {
    "image_index": 0,
    "fileName": "image_name_if_available",
    "breeds": [
      {
        "species": "Exact breed name from the lists above",
        "commonName": "Local/regional name if different",
        "confidence": 85,
        "description": "Detailed description of identifying features seen in this specific image",
        "breedCharacteristics": {
          "bodyStructure": "compact/medium/large frame description",
          "colorPattern": "Detailed color and markings description",
          "hornCharacteristics": "Horn size, shape, orientation if visible",
          "earShape": "Ear shape and size if visible",
          "facialFeatures": "Facial profile and distinctive features",
          "humpPresence": "Hump prominence for cattle (prominent/moderate/absent)",
          "overallConformation": "General body conformation and proportions"
        },
        "habitat": "Native region/state in India and current distribution",
        "conservation": "Indigenous/Crossbred/Rare/Vulnerable or specific conservation status",
        "isIndianBreed": true,
        "bpaRegistrationNotes": "Any important notes for BPA registration",
        "metadata": {
          "estimatedAge": "adult/young/calf based on visible features",
          "estimatedSize": "large/medium/small based on apparent size",
          "imageQualityNotes": "Notes about image quality affecting identification",
          "environmentalContext": "Background/environment description if relevant"
        }
      }
    ]
  }
]

ERROR CASES - If an image doesn't contain cattle/buffalo or contains non-Indian breeds, return:
{
  "image_index": [index],
  "fileName": "image_name_if_available", 
  "breeds": [],
  "error": "Descriptive error message explaining why no breeds were identified"
}

CRITICAL INSTRUCTIONS:
- Return ONLY the JSON array, no additional text
- Use "breeds" field (not "results")
- Use "image_index" field starting from 0
- Confidence as whole numbers 0-100 (not decimals)
- Each image gets its own object in the array
- Include image_index starting from 0
- All fields in breedCharacteristics must be filled with "Not clearly visible" if not apparent
- If multiple breeds could match in one image, choose the most likely based on visible characteristics

Analyze each image thoroughly and provide the most accurate breed identification possible based on visible characteristics.`;
};

// Multi-image breed identification function
export const identifyMultipleSpecies = async (
  files: File[],
  onProgress?: (progress: number, currentImage?: string) => void
): Promise<BatchAnalysisResult> => {
  const startTime = Date.now();
  
  try {
    // Validate input
    if (!files || files.length === 0) {
      throw new Error('No images provided for analysis');
    }
    
    if (files.length > 10) {
      throw new Error('Maximum 10 images allowed per batch analysis');
    }
    
    // Check API key
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }
    
    // Process images
    onProgress?.(10, 'Processing images...');
    const processedImages = await processMultipleImages(files);
    onProgress?.(30, 'Images processed, analyzing breeds...');
    
    // Create the multi-image request according to Gemini documentation
    const parts = [
      {
        text: createMultiImagePrompt(processedImages.length)
      }
    ];
    
    // Add all images as parts
    processedImages.forEach((processedImage) => {
      parts.push({
        inlineData: {
          mimeType: processedImage.mimeType,
          data: processedImage.base64
        }
      } as any);
    });
    
    const requestBody = {
      contents: [{
        parts: parts
      }],
      generationConfig: {
        temperature: 0.1, // Very low temperature for consistent breed identification
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 12288, // Increased for detailed multi-image responses
        responseMimeType: "application/json"
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    onProgress?.(50, 'Sending to AI for analysis...');
    
    // Calculate total request size for debugging
    const requestSize = JSON.stringify(requestBody).length;
    console.log(`Multi-image request size: ${(requestSize / 1024 / 1024).toFixed(2)}MB`);
    
    if (requestSize > 20 * 1024 * 1024) { // 20MB limit
      throw new Error('Total request size exceeds API limit. Please use fewer or smaller images.');
    }
    
    // Make API request
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    onProgress?.(80, 'Processing AI response...');
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      
      if (response.status === 400) {
        if (errorText.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later.');
        } else if (errorText.includes('safety')) {
          throw new Error('Content was blocked by safety filters. Please ensure images contain only cattle/buffalo.');
        } else if (errorText.includes('size') || errorText.includes('limit')) {
          throw new Error('Request size too large. Please use fewer or smaller images.');
        } else {
          throw new Error('Invalid request format. Please check your images and try again.');
        }
      } else if (response.status === 401) {
        throw new Error('API authentication failed. Please check configuration.');
      } else if (response.status === 403) {
        throw new Error('API access forbidden. Please check your API key permissions.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status >= 500) {
        throw new Error('Gemini service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`API request failed (${response.status}). Please try again.`);
      }
    }
    
    const data: GeminiResponse = await response.json();
    onProgress?.(90, 'Finalizing results...');
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No analysis results received from AI service.');
    }
    
    const responseText = data.candidates[0].content.parts[0].text;
    if (!responseText) {
      throw new Error('Empty response received from AI service.');
    }
    
    // Parse the JSON response and convert to standardized format
    let parsedResults: Array<{
      image_index: number;
      fileName?: string;
      breeds: StandardizedBreedIdentification[];
      error?: string;
    }>;
    
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
      console.log('Raw AI response:', responseText);
      console.log('Cleaned AI response:', cleanedText);
      
      parsedResults = JSON.parse(cleanedText);
      console.log('Parsed results:', parsedResults);
      
      if (!Array.isArray(parsedResults)) {
        console.error('Response is not an array:', parsedResults);
        throw new Error('Invalid response format: expected array of results');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText);
      console.error('Parse error:', parseError);
      throw new Error('Failed to parse AI analysis results. The response format was invalid.');
    }
    
    // Validate and enhance results with standardized processing
    const validatedResults: MultiImageAnalysisResult[] = [];
    let totalBreedsIdentified = 0;
    let totalConfidence = 0;
    let confidenceCount = 0;
    const breedCounts: Record<string, number> = {};
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const aiResult = parsedResults.find(r => r.image_index === i);
      
      console.log(`Looking for result with image_index ${i}, found:`, aiResult);
      
      if (!aiResult) {
        // No result found for this image
        console.log(`No AI result found for image index ${i} (${file.name})`);
        validatedResults.push({
          image_index: i,
          fileName: file.name,
          breeds: [],
          error: 'No analysis result received for this image'
        });
        continue;
      }
      
      if (aiResult.error) {
        console.log(`AI result has error for image ${i}:`, aiResult.error);
        validatedResults.push({
          image_index: i,
          fileName: file.name,
          breeds: [],
          error: aiResult.error
        });
        continue;
      }
      
      if (!aiResult.breeds || !Array.isArray(aiResult.breeds)) {
        validatedResults.push({
          image_index: i,
          fileName: file.name,
          breeds: [],
          error: 'Invalid results format from AI analysis'
        });
        continue;
      }
      
      // Validate and process standardized breed results
      const validStandardizedResults = aiResult.breeds.filter((result): result is StandardizedBreedIdentification => {
        if (!isValidBreedIdentification(result)) {
          console.warn('Invalid breed identification result:', result);
          return false;
        }
        
        // Ensure all required characteristics are present
        if (!result.breedCharacteristics) {
          result.breedCharacteristics = {
            bodyStructure: "Details not clearly visible",
            colorPattern: "Details not clearly visible",
            overallConformation: "Details not clearly visible"
          };
        }
        
        // Add metadata extraction from description
        if (!result.metadata) {
          result.metadata = extractBreedMetadata(result.description);
        }
        
        return true;
      });
      
      // Convert to legacy format for backward compatibility
      const legacyResults: SpeciesIdentification[] = validStandardizedResults.map(result => {
        // Track breed counts and confidence for summary
        breedCounts[result.species] = (breedCounts[result.species] || 0) + 1;
        totalConfidence += result.confidence;
        confidenceCount++;
        
        return {
          species: result.species,
          commonName: result.commonName,
          confidence: result.confidence,
          description: result.description,
          habitat: result.habitat,
          conservation: result.conservation,
          isIndianBreed: result.isIndianBreed
        };
      });
      
      if (legacyResults.length === 0) {
        validatedResults.push({
          image_index: i,
          fileName: file.name,
          breeds: [],
          error: 'No valid breed identifications found in this image'
        });
      } else {
        totalBreedsIdentified += legacyResults.length;
        validatedResults.push({
          image_index: i,
          fileName: file.name,
          breeds: legacyResults
        });
      }
    }
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    onProgress?.(100, 'Analysis complete!');
    
    const successfulAnalyses = validatedResults.filter(r => !r.error && r.breeds.length > 0).length;
    const failedAnalyses = validatedResults.filter(r => r.error || r.breeds.length === 0).length;
    const averageConfidence = confidenceCount > 0 ? Math.round(totalConfidence / confidenceCount) : 0;
    
    // Get most common breeds
    const mostCommonBreeds = Object.entries(breedCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([breed]) => breed);
    
    return {
      success: successfulAnalyses > 0,
      results: validatedResults,
      summary: {
        totalImages: files.length,
        successfulAnalyses,
        failedAnalyses,
        totalBreedsIdentified,
        processingTime,
        averageConfidence,
        mostCommonBreeds
      }
    };
    
  } catch (error) {
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    console.error('Multi-image analysis error:', error);
    
    let errorMessage = 'An unexpected error occurred during multi-image analysis.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      results: files.map((file, index) => ({
        image_index: index,
        fileName: file.name,
        breeds: [],
        error: errorMessage
      })),
      summary: {
        totalImages: files.length,
        successfulAnalyses: 0,
        failedAnalyses: files.length,
        totalBreedsIdentified: 0,
        processingTime,
        averageConfidence: 0,
        mostCommonBreeds: []
      },
      error: errorMessage
    };
  }
};

// Helper function for single image analysis within multi-image context
export const identifySpeciesInBatch = async (
  file: File,
  imageIndex: number
): Promise<MultiImageAnalysisResult> => {
  try {
    const batchResult = await identifyMultipleSpecies([file]);
    return batchResult.results[0];
  } catch (error) {
    return {
      image_index: imageIndex,
      fileName: file.name,
      breeds: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Export utility functions
export { processMultipleImages as processImages };
