// Optimized Gemini API service for cattle and buffalo breed identification
// Standardized for BPA (Bharat Pashudhan App) integration
import { 
  StandardizedBreedIdentification, 
  SingleImageBreedResult,
  INDIAN_CATTLE_BREEDS,
  INDIAN_BUFFALO_BREEDS,
  isValidBreedIdentification,
  extractBreedMetadata,
  SpeciesIdentification
} from '@/types/breedIdentification';
import { fileSchema, breedIdentificationRequestSchema, validateEnv } from '@/lib/validation';

// Validate environment at module load
const env = validateEnv();
const GEMINI_API_KEY = env.VITE_GEMINI_API_KEY;
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

// Export for backward compatibility
export type { SpeciesIdentification };

// Optimized image processing with comprehensive error handling
export const processImageFile = async (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const maxSize = 1024 * 1024; // 1MB target size
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available. Please try again or use a different browser.'));
        return;
      }

      const img = new Image();

      img.onload = () => {
        try {
          // Validate image dimensions
          if (img.width < 50 || img.height < 50) {
            reject(new Error('Image is too small. Please upload an image that is at least 50x50 pixels.'));
            return;
          }

          if (img.width > 10000 || img.height > 10000) {
            reject(new Error('Image dimensions are too large. Please upload a smaller image.'));
            return;
          }

          // Calculate optimal dimensions while maintaining aspect ratio
          const maxDimension = 1024; // Max width/height
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
          
          // Start with high quality and reduce if needed
          let quality = 0.8;
          let result = canvas.toDataURL('image/jpeg', quality);
          
          // Reduce quality until under size limit
          while (result.length > maxSize && quality > 0.1) {
            quality -= 0.1;
            result = canvas.toDataURL('image/jpeg', quality);
          }

          // Check if we could compress sufficiently
          if (result.length > maxSize) {
            reject(new Error('Unable to compress image to acceptable size. Please use a smaller or simpler image.'));
            return;
          }

          const base64 = result.split(',')[1];
          if (!base64) {
            reject(new Error('Failed to process image data. Please try with a different image.'));
            return;
          }

          resolve({
            base64,
            mimeType: 'image/jpeg'
          });
        } catch (processingError) {
          reject(new Error('Error processing image. Please try with a different image.'));
        }
      };

      img.onerror = (error) => {
        reject(new Error('Failed to load image. Please ensure the file is a valid image format.'));
      };

      // Set image source with error handling
      try {
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
        
        // Clean up object URL after some time to prevent memory leaks
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 10000);
      } catch (urlError) {
        reject(new Error('Failed to create image URL. Please try with a different file.'));
      }
    } catch (error) {
      reject(new Error('Image processing failed. Please try again with a different image.'));
    }
  });
};

// Legacy method for compatibility
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Get MIME type from file
export const getMimeType = (file: File): string => {
  return file.type || 'image/jpeg';
};

export const identifySpecies = async (imageFile: File): Promise<SpeciesIdentification[]> => {
  try {
    // Validate file size and type
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxFileSize) {
      throw new Error('Image file is too large. Please upload an image smaller than 10MB.');
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    if (!validTypes.includes(imageFile.type.toLowerCase())) {
      throw new Error('Unsupported file format. Please upload a JPEG, PNG, WEBP, or HEIC image.');
    }

    // Use optimized image processing
    const { base64: base64Image, mimeType } = await processImageFile(imageFile);

    // Create standardized breed identification prompt
    const prompt = `You are an expert veterinarian and animal breed specialist with extensive knowledge of Indian cattle and buffalo breeds. Your task is to analyze this image for breed identification to support the Bharat Pashudhan App (BPA) registration system.

ANALYSIS REQUIREMENTS:
1. Only identify if you can clearly see cattle or buffalo in the image
2. Only identify INDIAN breeds (Indigenous, crossbred, or breeds commonly found in India)
3. Focus on distinctive breed characteristics visible in the image
4. Provide detailed analysis for BPA registration

INDIAN CATTLE BREEDS TO CONSIDER:
${INDIAN_CATTLE_BREEDS.join(', ')}

INDIAN BUFFALO BREEDS TO CONSIDER:
${INDIAN_BUFFALO_BREEDS.join(', ')}

RESPONSE FORMAT - Return ONLY valid JSON in this exact structure:
[
  {
    "species": "Exact breed name from the lists above",
    "commonName": "Local/regional name if different from species",
    "confidence": 85,
    "description": "Detailed description of visible identifying features in this specific image",
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

ERROR CASES - If any of these apply, return this exact JSON format:
For non-cattle/buffalo animals:
[{"error": "NOT_CATTLE_BUFFALO", "message": "This image does not contain cattle or buffalo. Please upload an image of cattle or buffalo for breed identification."}]

For non-Indian breeds:
[{"error": "NON_INDIAN_BREED", "message": "The animals in this image appear to be foreign breeds not commonly found in India. Please upload an image of Indian cattle or buffalo breeds."}]

For poor image quality:
[{"error": "POOR_IMAGE_QUALITY", "message": "The image quality is too poor or animals are not clearly visible. Please upload a clearer, well-lit image of the animals."}]

For no animals visible:
[{"error": "NO_ANIMALS_VISIBLE", "message": "No animals are clearly visible in this image. Please upload an image that clearly shows cattle or buffalo."}]

CRITICAL INSTRUCTIONS:
- Return ONLY the JSON array, no additional text
- Confidence scores must be whole numbers (0-100)
- All fields in breedCharacteristics must be filled with "Not clearly visible" if not apparent
- Focus on accuracy over speed - only identify breeds you are confident about
- If multiple breeds could match, choose the most likely based on visible characteristics
- Provide specific, detailed descriptions based on what you actually see in the image

Analyze this image now:`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    // Clean up the response text to extract JSON
    let cleanedResponse = responseText.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    try {
      const results: StandardizedBreedIdentification[] = JSON.parse(cleanedResponse);
      
      // Check if response contains error cases
      if (results.length > 0 && results[0].error) {
        const errorResult = results[0];
        switch (errorResult.error) {
          case 'NOT_CATTLE_BUFFALO':
            throw new Error('This image does not contain cattle or buffalo. Please upload an image of cattle or buffalo for breed identification.');
          case 'NON_INDIAN_BREED':
            throw new Error('The animals in this image appear to be foreign breeds not commonly found in India. Please upload an image of Indian cattle or buffalo breeds for BPA registration.');
          case 'POOR_IMAGE_QUALITY':
            throw new Error('The image quality is too poor or animals are not clearly visible. Please upload a clearer, well-lit image showing the animals\' distinctive features.');
          case 'NO_ANIMALS_VISIBLE':
            throw new Error('No animals are clearly visible in this image. Please upload an image that clearly shows cattle or buffalo.');
          default:
            throw new Error(errorResult.message || 'Unable to identify breeds in this image. Please try with a different image.');
        }
      }

      // Validate that we have actual breed identifications
      if (results.length === 0) {
        throw new Error('No Indian cattle or buffalo breeds could be identified in this image. Please ensure the image clearly shows Indian breeds and try again.');
      }

      // Validate and enhance results with standardized format
      const validResults = results.filter((result): result is StandardizedBreedIdentification => {
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

      if (validResults.length === 0) {
        throw new Error('Unable to confidently identify any Indian cattle or buffalo breeds in this image. Please try with a clearer image of Indian breeds.');
      }

      // Convert to legacy format for backward compatibility
      const legacyResults: SpeciesIdentification[] = validResults.map(result => ({
        species: result.species,
        commonName: result.commonName,
        confidence: result.confidence,
        description: result.description,
        habitat: result.habitat,
        conservation: result.conservation,
        isIndianBreed: result.isIndianBreed
      }));

      return legacyResults;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', cleanedResponse);
      throw new Error('The AI service returned an unexpected response. Please try again or contact support if the issue persists.');
    }

  } catch (error) {
    console.error('Error identifying breed:', error);
    
    // Provide user-friendly error messages based on error type
    if (error instanceof Error) {
      // If it's already a user-friendly error, pass it through
      if (error.message.includes('does not contain cattle') || 
          error.message.includes('foreign breeds') ||
          error.message.includes('image quality') ||
          error.message.includes('clearly visible') ||
          error.message.includes('file is too large') ||
          error.message.includes('Unsupported file format')) {
        throw error;
      }
      
      // Handle API errors
      if (error.message.includes('Gemini API error')) {
        throw new Error('The breed identification service is temporarily unavailable. Please try again in a few moments.');
      }
      
      // Handle network errors
      if (error.message.includes('fetch') || error.message.includes('network')) {
        throw new Error('Network connection error. Please check your internet connection and try again.');
      }
    }
    
    // Default fallback error
    throw new Error('Unable to analyze the image for breed identification. Please ensure you have uploaded a clear image of Indian cattle or buffalo and try again.');
  }
};