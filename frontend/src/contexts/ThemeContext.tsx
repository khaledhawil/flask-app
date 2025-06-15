import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  cardBg: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

interface ThemeGradients {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeData {
  colors: ThemeColors;
  gradients: ThemeGradients;
}

interface ThemeContextType {
  theme: ThemeData;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const lightTheme: ThemeData = {
  colors: {
    primary: '#4F46E5',
    secondary: '#7C3AED',
    accent: '#10B981',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    cardBg: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    secondary: 'linear-gradient(135deg, #10B981, #059669)',
    accent: 'linear-gradient(135deg, #F59E0B, #D97706)'
  }
};

const darkTheme: ThemeData = {
  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#34D399',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    background: '#0F172A',
    surface: '#1E293B',
    cardBg: '#334155',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#475569',
    shadow: 'rgba(0, 0, 0, 0.3)'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    secondary: 'linear-gradient(135deg, #34D399, #10B981)',
    accent: 'linear-gradient(135deg, #FBBF24, #F59E0B)'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check if user has a preference stored in localStorage
    const stored = localStorage.getItem('theme');
    if (stored) {
      return stored === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme: ThemeData = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setIsDarkMode(newTheme === 'dark');
  };

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update HTML class for Tailwind CSS dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const stored = localStorage.getItem('theme');
      if (!stored) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const value: ThemeContextType = {
    isDarkMode,
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};