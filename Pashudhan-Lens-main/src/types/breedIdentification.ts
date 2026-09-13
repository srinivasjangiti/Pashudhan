// Standardized breed identification types for both single and multi-image analysis
// Supporting the Bharat Pashudhan App (BPA) integration

export interface StandardizedBreedIdentification {
  // Core breed information
  species: string; // Official breed name
  commonName?: string; // Local/regional name
  confidence: number; // Confidence score (0-100)
  
  // Detailed breed characteristics
  description: string; // Detailed description of identifying features
  breedCharacteristics: {
    bodyStructure: string; // e.g., "compact", "large", "medium"
    colorPattern: string; // e.g., "solid brown", "white with brown patches"
    hornCharacteristics?: string; // e.g., "medium curved horns", "polled"
    earShape?: string; // e.g., "drooping", "erect", "medium"
    facialFeatures?: string; // e.g., "broad forehead", "distinctive facial profile"
    humpPresence?: string; // For cattle: "prominent", "moderate", "absent"
    overallConformation: string; // General body conformation notes
  };
  
  // Geographic and conservation information
  habitat: string; // Native region/state in India and current distribution
  conservation: string; // Conservation status (Indigenous, Crossbred, Rare, etc.)
  
  // BPA-specific metadata
  isIndianBreed: true; // Always true for our system
  bpaRegistrationNotes?: string; // Additional notes for BPA registration
  
  // Additional metadata for future extensibility
  metadata?: {
    estimatedAge?: string; // e.g., "adult", "young", "calf"
    estimatedSize?: string; // e.g., "large", "medium", "small"
    healthIndicators?: string[]; // Observable health indicators
    environmentalContext?: string; // Background/environment notes
    imageQualityNotes?: string; // Notes about image quality affecting identification
    alternativePossibleBreeds?: string[]; // Other potential breed matches
    crossbreedingIndicators?: string; // Signs of crossbreeding if detected
    seasonalConsiderations?: string; // Season-specific appearance factors
  };
  
  // Error handling (for compatibility)
  error?: string;
  message?: string;
}

// Single image result
export interface SingleImageBreedResult {
  success: boolean;
  breeds: StandardizedBreedIdentification[];
  analysisMetadata: {
    imageSize: string;
    processingTime: number;
    timestamp: string;
    analysisType: "single-image";
  };
  error?: string;
}

// Multi-image result for individual images
export interface MultiImageBreedResult {
  imageIndex: number;
  fileName: string;
  breeds: StandardizedBreedIdentification[];
  error?: string;
}

// Batch analysis result for multiple images
export interface BatchBreedAnalysisResult {
  success: boolean;
  results: MultiImageBreedResult[];
  summary: {
    totalImages: number;
    successfulAnalyses: number;
    failedAnalyses: number;
    totalBreedsIdentified: number;
    processingTime: number;
    averageConfidence: number;
    mostCommonBreeds: string[];
  };
  analysisMetadata: {
    timestamp: string;
    analysisType: "multi-image";
    batchSize: number;
  };
  error?: string;
}

// Comprehensive Indian breed list for validation and prompts
export const INDIAN_CATTLE_BREEDS = [
  // Indigenous cattle breeds
  "Gir", "Sahiwal", "Red Sindhi", "Tharparkar", "Kankrej", "Ongole", "Krishna Valley",
  "Hariana", "Amritmahal", "Hallikar", "Kangayam", "Pulikulam", "Vechur", "Punganur",
  "Kasargod", "Bargur", "Malnad Gidda", "Bachaur", "Gangatiri", "Siri", "Kherigarh",
  "Mewati", "Nimari", "Dangi", "Deoni", "Khillar", "Gaolao", "Lakhimi", "Bhagnari",
  "Rathi", "Nagori", "Alambadi", "Banni", "Bhadawari", "Toda", "Umblachery",
  
  // Crossbred and improved breeds commonly found in India
  "Holstein Friesian", "Jersey", "Brown Swiss", "Ayrshire", "Red Dane", "Guernsey"
] as const;

export const INDIAN_BUFFALO_BREEDS = [
  // Indigenous buffalo breeds
  "Murrah", "Mehsana", "Surti", "Jaffarabadi", "Nili-Ravi", "Pandharpuri", "Nagpuri",
  "Toda", "Banni", "Marathwadi", "Kalahandi", "Sambalpuri", "Chilika", "Dharwadi",
  "Godavari", "Bhadawari"
] as const;

// Error types for standardized error handling
export interface BreedIdentificationError {
  code: string;
  message: string;
  userFriendlyMessage: string;
  suggestions?: string[];
}

export const BREED_ERROR_CODES = {
  NOT_CATTLE_BUFFALO: "NOT_CATTLE_BUFFALO",
  NON_INDIAN_BREED: "NON_INDIAN_BREED", 
  POOR_IMAGE_QUALITY: "POOR_IMAGE_QUALITY",
  NO_ANIMALS_VISIBLE: "NO_ANIMALS_VISIBLE",
  MULTIPLE_SPECIES: "MULTIPLE_SPECIES",
  UNCLEAR_BREED_FEATURES: "UNCLEAR_BREED_FEATURES",
  API_QUOTA_EXCEEDED: "API_QUOTA_EXCEEDED",
  NETWORK_ERROR: "NETWORK_ERROR",
  PROCESSING_ERROR: "PROCESSING_ERROR"
} as const;

// Legacy interface for backward compatibility
export interface SpeciesIdentification extends Omit<StandardizedBreedIdentification, 'breedCharacteristics' | 'metadata'> {
  // Maintain compatibility with existing frontend
}

// Type guards for validation
export function isValidBreedIdentification(obj: any): obj is StandardizedBreedIdentification {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.species === 'string' &&
    typeof obj.confidence === 'number' &&
    obj.confidence >= 0 &&
    obj.confidence <= 100 &&
    typeof obj.description === 'string' &&
    typeof obj.habitat === 'string' &&
    obj.isIndianBreed === true
  );
}

// Utility function to convert legacy format to standardized format
export function convertLegacyToStandardized(legacy: SpeciesIdentification): StandardizedBreedIdentification {
  return {
    species: legacy.species,
    commonName: legacy.commonName,
    confidence: legacy.confidence || 0,
    description: legacy.description || "Breed characteristics not available",
    breedCharacteristics: {
      bodyStructure: "Details not available",
      colorPattern: "Details not available", 
      overallConformation: "Details not available"
    },
    habitat: legacy.habitat || "Origin information not available",
    conservation: legacy.conservation || "Status information not available",
    isIndianBreed: true,
    error: legacy.error,
    message: legacy.message
  };
}

// Utility function to extract enhanced metadata from AI response
export function extractBreedMetadata(aiResponse: string): Partial<StandardizedBreedIdentification['metadata']> {
  const metadata: Partial<StandardizedBreedIdentification['metadata']> = {};
  
  // Extract age indicators
  if (/young|calf|juvenile/i.test(aiResponse)) {
    metadata.estimatedAge = "young";
  } else if (/adult|mature/i.test(aiResponse)) {
    metadata.estimatedAge = "adult";
  }
  
  // Extract size indicators
  if (/large|big/i.test(aiResponse)) {
    metadata.estimatedSize = "large";
  } else if (/small|compact/i.test(aiResponse)) {
    metadata.estimatedSize = "small";
  } else if (/medium/i.test(aiResponse)) {
    metadata.estimatedSize = "medium";
  }
  
  return metadata;
}
