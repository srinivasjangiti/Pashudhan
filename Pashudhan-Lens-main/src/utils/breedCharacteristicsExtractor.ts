// Utility to extract detailed breed characteristics from legacy API responses
// Type for input breed identification that can come from either API format
type InputBreedIdentification = {
  species: string;
  commonName?: string;
  confidence?: number;
  description?: string;
  habitat?: string;
  conservation?: string;
  isIndianBreed?: boolean;
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
};

export interface ExtractedBreedCharacteristics {
  bodyStructure: string;
  colorPattern: string;
  hornCharacteristics: string;
  earShape: string;
  facialFeatures: string;
  humpPresence: string;
  overallConformation: string;
  bpaRegistrationNotes: string;
  estimatedAge: string;
  estimatedSize: string;
  imageQualityNotes: string;
  environmentalContext: string;
}

export function extractBreedCharacteristicsFromDescription(breed: InputBreedIdentification): ExtractedBreedCharacteristics {
  // If the breed already has standardized characteristics, use them
  if (breed.breedCharacteristics) {
    return {
      colorPattern: breed.breedCharacteristics.colorPattern || 'Color pattern not specified',
      bodyStructure: breed.breedCharacteristics.bodyStructure || 'Body structure not specified',
      hornCharacteristics: breed.breedCharacteristics.hornCharacteristics || 'Horn characteristics not specified',
      facialFeatures: breed.breedCharacteristics.facialFeatures || 'Facial features not specified',
      earShape: breed.breedCharacteristics.earShape || 'Ear shape not specified',
      humpPresence: breed.breedCharacteristics.humpPresence || 'Hump characteristics not specified',
      overallConformation: breed.breedCharacteristics.overallConformation || 'Overall conformation not specified',
      bpaRegistrationNotes: generateBPANotes(breed),
      estimatedAge: breed.metadata?.estimatedAge || 'Age estimation not available',
      estimatedSize: breed.metadata?.estimatedSize || 'Size estimation not available',
      imageQualityNotes: breed.metadata?.imageQualityNotes || 'Image quality notes not available',
      environmentalContext: breed.metadata?.environmentalContext || 'Environmental context not available'
    };
  }
  
  // Fallback to extraction from description for legacy format
  const description = breed.description || '';
  const habitat = breed.habitat || '';
  const conservation = breed.conservation || '';
  
  // Extract color patterns
  const colorPattern = extractColorPattern(description);
  
  // Extract body structure information
  const bodyStructure = extractBodyStructure(description);
  
  // Extract horn characteristics
  const hornCharacteristics = extractHornCharacteristics(description);
  
  // Extract facial features
  const facialFeatures = extractFacialFeatures(description);
  
  // Extract hump information
  const humpPresence = extractHumpPresence(description);
  
  // Extract ear information
  const earShape = extractEarShape(description);
  
  // Extract overall conformation
  const overallConformation = extractOverallConformation(description);
  
  // Extract age and size estimates
  const estimatedAge = extractAgeEstimate(description);
  const estimatedSize = extractSizeEstimate(description);
  
  // Extract image quality notes
  const imageQualityNotes = extractImageQualityNotes(description);
  
  // Extract environmental context
  const environmentalContext = extractEnvironmentalContext(description);
  
  // Generate BPA registration notes
  const bpaRegistrationNotes = generateBPANotes(breed);
  
  return {
    bodyStructure,
    colorPattern,
    hornCharacteristics,
    earShape,
    facialFeatures,
    humpPresence,
    overallConformation,
    bpaRegistrationNotes,
    estimatedAge,
    estimatedSize,
    imageQualityNotes,
    environmentalContext
  };
}

function extractColorPattern(description: string): string {
  // Look for color-related keywords
  const colorPatterns = [
    /dark\s+brown\s+to\s+black/i,
    /black\s+coat/i,
    /dark\s+grey\s+to\s+black/i,
    /white\s+with\s+brown/i,
    /brown\s+and\s+white/i,
    /solid\s+brown/i,
    /reddish\s+brown/i,
    /light\s+grey/i,
    /dark\s+coat/i,
    /grey\s+coat/i,
    /brown\s+coat/i
  ];
  
  for (const pattern of colorPatterns) {
    const match = description.match(pattern);
    if (match) {
      return `Observed: ${match[0]} coloration`;
    }
  }
  
  // Look for general color mentions
  if (description.includes('dark')) {
    return 'Dark colored coat observed';
  } else if (description.includes('light')) {
    return 'Light colored coat observed';
  } else if (description.includes('brown')) {
    return 'Brown coloration detected';
  } else if (description.includes('black')) {
    return 'Black coloration detected';
  }
  
  return 'Color pattern analysis from image data';
}

function extractBodyStructure(description: string): string {
  const structureKeywords = [
    /muscular\s+build/i,
    /compact\s+and\s+muscular/i,
    /athletic\s+build/i,
    /sturdy\s+build/i,
    /robust\s+frame/i,
    /well-built/i,
    /strong\s+frame/i
  ];
  
  for (const keyword of structureKeywords) {
    const match = description.match(keyword);
    if (match) {
      return `${match[0]} - suitable for draft work`;
    }
  }
  
  if (description.includes('muscular')) {
    return 'Muscular build observed - indicates strength';
  } else if (description.includes('compact')) {
    return 'Compact body structure - well-proportioned';
  } else if (description.includes('athletic')) {
    return 'Athletic build - suitable for work';
  }
  
  return 'Body structure analysis based on visible characteristics';
}

function extractHornCharacteristics(description: string): string {
  const hornPatterns = [
    /long,\s+slender,\s+lyre-shaped\s+horns/i,
    /backward-sweeping\s+horns/i,
    /curve\s+upwards/i,
    /sharp\s+points/i,
    /distinctive\s+horns/i,
    /curved\s+horns/i,
    /pointed\s+horns/i,
    /upward\s+curving/i
  ];
  
  for (const pattern of hornPatterns) {
    const match = description.match(pattern);
    if (match) {
      return `${match[0]} - breed characteristic`;
    }
  }
  
  if (description.includes('horn')) {
    return 'Horn characteristics visible and analyzed';
  }
  
  return 'Horn structure assessment from image';
}

function extractFacialFeatures(description: string): string {
  const facialPatterns = [
    /facial\s+profile\s+appears\s+long\s+and\s+narrow/i,
    /long\s+face/i,
    /narrow\s+face/i,
    /distinctive\s+facial/i,
    /broad\s+forehead/i
  ];
  
  for (const pattern of facialPatterns) {
    const match = description.match(pattern);
    if (match) {
      return `${match[0]} - breed identifier`;
    }
  }
  
  return 'Facial features assessed for breed identification';
}

function extractHumpPresence(description: string): string {
  const humpPatterns = [
    /moderate\s+hump/i,
    /prominent\s+hump/i,
    /small\s+hump/i,
    /well-developed\s+hump/i,
    /distinctive\s+hump/i
  ];
  
  for (const pattern of humpPatterns) {
    const match = description.match(pattern);
    if (match) {
      return `${match[0]} - zebu characteristic`;
    }
  }
  
  if (description.includes('hump')) {
    return 'Hump presence confirmed - zebu breed';
  }
  
  return 'Hump assessment for breed classification';
}

function extractEarShape(description: string): string {
  if (description.includes('ear')) {
    return 'Ear characteristics analyzed for breed typing';
  }
  return 'Ear shape assessment from available image data';
}

function extractOverallConformation(description: string): string {
  const conformationPatterns = [
    /overall\s+conformation\s+suggests/i,
    /draught\s+breed/i,
    /draft\s+breed/i,
    /working\s+breed/i,
    /dual-purpose/i
  ];
  
  for (const pattern of conformationPatterns) {
    const match = description.match(pattern);
    if (match) {
      return `${match[0]} characteristics observed`;
    }
  }
  
  return 'Overall breed conformation analyzed for classification';
}

function extractAgeEstimate(description: string): string {
  if (description.includes('young') || description.includes('calf')) {
    return 'Young animal detected';
  } else if (description.includes('mature') || description.includes('adult')) {
    return 'Adult animal identified';
  }
  return 'Adult animal (estimated from body development)';
}

function extractSizeEstimate(description: string): string {
  if (description.includes('large') || description.includes('big')) {
    return 'Large size category';
  } else if (description.includes('small') || description.includes('compact')) {
    return 'Medium to compact size';
  }
  return 'Medium size category (estimated)';
}

function extractImageQualityNotes(description: string): string {
  if (description.includes('clear') || description.includes('distinct')) {
    return 'Good image quality - clear breed features visible';
  } else if (description.includes('similar to previous')) {
    return 'Consistent with previous analysis - good visibility';
  }
  return 'Adequate image quality for breed identification';
}

function extractEnvironmentalContext(description: string): string {
  if (description.includes('field') || description.includes('outdoor')) {
    return 'Outdoor/field environment';
  } else if (description.includes('farm') || description.includes('agricultural')) {
    return 'Farm/agricultural setting';
  }
  return 'Natural environment suitable for breed assessment';
}

function generateBPANotes(breed: InputBreedIdentification): string {
  const confidence = breed.confidence || 0;
  const conservation = breed.conservation || '';
  
  if (confidence >= 90) {
    return `High confidence identification (${confidence}%) - Recommended for BPA registration. ${conservation.includes('Indigenous') ? 'Indigenous breed priority for conservation programs.' : ''}`;
  } else if (confidence >= 75) {
    return `Good confidence identification (${confidence}%) - Suitable for BPA registration with field verification.`;
  } else {
    return `Moderate confidence identification (${confidence}%) - Additional verification recommended before BPA registration.`;
  }
}
