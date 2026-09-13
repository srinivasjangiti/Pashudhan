import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, Download } from 'lucide-react';
import { materialShadows, materialTransitions, materialCards, materialButtons } from '@/lib/material';
import { SpeciesIdentification } from '@/services/geminiApi';

interface SpeciesResultsProps {
  imageUrl: string;
  results: SpeciesIdentification[];
  onReset: () => void;
}

export const SpeciesResults: React.FC<SpeciesResultsProps> = ({ 
  imageUrl, 
  results, 
  onReset 
}) => {
  const downloadResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      results
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cattle-buffalo-breed-identification-results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Material Design Image Preview with better visibility */}
      <div className="overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm border border-emerald-100/50 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Analyzed cattle/buffalo" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-3">
            <Button 
              onClick={onReset}
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 bg-white/90 hover:bg-white backdrop-blur-sm rounded-xl px-4 py-2 font-medium transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Image
            </Button>
            <Button 
              onClick={downloadResults}
              variant="default"
              className="rounded-xl px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Material Design Results with better visibility */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Breeds Identified ({results.length})
          </h2>
          <Badge className="bg-emerald-50/90 border border-emerald-200/50 text-emerald-800 font-semibold px-4 py-2 rounded-xl">
            Breed Analysis Complete
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {results.map((species, index) => (
            <div key={index} className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-emerald-200/80">
              <div className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {species.species}
                    </h3>
                    {species.commonName && (
                      <p className="text-base text-emerald-800 mt-2 font-semibold">
                        {species.commonName}
                      </p>
                    )}
                  </div>
                  {species.confidence && (
                    <Badge 
                      className={species.confidence > 80 
                        ? "bg-emerald-600 text-white border-emerald-500/30 font-semibold px-3 py-1 rounded-lg shadow-sm" 
                        : "bg-gray-100 text-gray-800 border-gray-200/50 font-semibold px-3 py-1 rounded-lg"
                      }
                    >
                      {species.confidence}%
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                {species.description && (
                  <div className="bg-emerald-50/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-100/50">
                    <h4 className="font-semibold text-sm text-emerald-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-900 leading-relaxed font-medium">{species.description}</p>
                  </div>
                )}
                
                {species.habitat && (
                  <div className="bg-emerald-50/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-100/50">
                    <h4 className="font-semibold text-sm text-emerald-900 mb-2">Origin & Distribution</h4>
                    <p className="text-sm text-gray-900 leading-relaxed font-medium">{species.habitat}</p>
                  </div>
                )}
                
                {species.conservation && (
                  <div className="bg-emerald-50/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-100/50">
                    <h4 className="font-semibold text-sm text-emerald-900 mb-2">Breed Status</h4>
                    <Badge className="bg-white/90 border border-emerald-200/50 text-emerald-800 font-semibold px-3 py-1 rounded-lg">
                      {species.conservation}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};