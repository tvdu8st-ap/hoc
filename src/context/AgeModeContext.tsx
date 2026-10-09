import React, { createContext, useContext, useState, useEffect } from 'react';
import { GradeLevel } from '../types';

interface AgeModeContextType {
  mode: GradeLevel;
  setMode: (mode: GradeLevel) => void;
  isPrimary: boolean;
  isSecondary: boolean;
  toggleMode: () => void;
}

const AgeModeContext = createContext<AgeModeContextType | undefined>(undefined);

export const AgeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<GradeLevel>(() => {
    const saved = localStorage.getItem('gln_age_mode');
    return saved === 'PRIMARY' ? 'PRIMARY' : 'SECONDARY';
  });

  const setMode = (newMode: GradeLevel) => {
    setModeState(newMode);
    localStorage.setItem('gln_age_mode', newMode);
  };

  const toggleMode = () => {
    setMode(mode === 'PRIMARY' ? 'SECONDARY' : 'PRIMARY');
  };

  return (
    <AgeModeContext.Provider
      value={{
        mode,
        setMode,
        isPrimary: mode === 'PRIMARY',
        isSecondary: mode === 'SECONDARY',
        toggleMode,
      }}
    >
      {children}
    </AgeModeContext.Provider>
  );
};

export const useAgeMode = () => {
  const context = useContext(AgeModeContext);
  if (!context) throw new Error('useAgeMode must be used within an AgeModeProvider');
  return context;
};
