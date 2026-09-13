import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SpeciesIdentification } from '@/services/geminiApi';

interface AppState {
  currentPage: 'home' | 'upload' | 'results' | 'about';
  resultsData: {
    imageUrl: string;
    results: SpeciesIdentification[];
  } | null;
  navigationHistory: string[];
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  navigateTo: (page: 'home' | 'upload' | 'results' | 'about', direction?: 'forward' | 'backward') => void;
  setResults: (imageUrl: string, results: SpeciesIdentification[]) => void;
  setLoading: (loading: boolean) => void;
  clearResults: () => void;
  getDirection: () => 'forward' | 'backward';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  currentPage: 'home',
  resultsData: null,
  navigationHistory: ['home'],
  isLoading: false,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const navigateTo = (page: 'home' | 'upload' | 'results' | 'about', direction?: 'forward' | 'backward') => {
    setState(prev => {
      const newHistory = direction === 'backward' 
        ? prev.navigationHistory.slice(0, -1)
        : [...prev.navigationHistory, page];
      
      return {
        ...prev,
        currentPage: page,
        navigationHistory: newHistory.length > 0 ? newHistory : [page],
      };
    });
  };

  const setResults = (imageUrl: string, results: SpeciesIdentification[]) => {
    setState(prev => ({
      ...prev,
      resultsData: { imageUrl, results },
    }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  };

  const clearResults = () => {
    setState(prev => ({
      ...prev,
      resultsData: null,
    }));
  };

  const getDirection = (): 'forward' | 'backward' => {
    const pageOrder = ['home', 'about', 'upload', 'results'];
    const currentIndex = pageOrder.indexOf(state.currentPage);
    const historyLength = state.navigationHistory.length;
    
    if (historyLength >= 2) {
      const prevPage = state.navigationHistory[historyLength - 2];
      const prevIndex = pageOrder.indexOf(prevPage);
      return currentIndex > prevIndex ? 'forward' : 'backward';
    }
    
    return 'forward';
  };

  return (
    <AppContext.Provider value={{
      state,
      navigateTo,
      setResults,
      setLoading,
      clearResults,
      getDirection,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
