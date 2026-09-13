import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type FontSizeScale = 'small' | 'normal' | 'large' | 'xlarge';
export type ContrastTheme = 'normal' | 'high-contrast-light' | 'high-contrast-dark' | 'dark-maroon';

export interface AccessibilitySettings {
  fontSize: FontSizeScale;
  contrastTheme: ContrastTheme;
}

interface AccessibilityContextType {
  fontSize: FontSizeScale;
  contrastTheme: ContrastTheme;
  setFontSize: (size: FontSizeScale) => void;
  setContrastTheme: (theme: ContrastTheme) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
  resetAccessibility: () => void;
  isHighContrast: boolean;
}

const STORAGE_KEY = 'heyo_accessibility_settings';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  contrastTheme: 'normal'
};

const FONT_SIZE_SCALES: Record<FontSizeScale, string> = {
  small: '88%',
  normal: '100%',
  large: '115%',
  xlarge: '130%'
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  fontSize: 'normal',
  contrastTheme: 'normal',
  setFontSize: () => {},
  setContrastTheme: () => {},
  increaseFontSize: () => {},
  decreaseFontSize: () => {},
  toggleHighContrast: () => {},
  resetAccessibility: () => {},
  isHighContrast: false
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSizeScale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fontSize && ['small', 'normal', 'large', 'xlarge'].includes(parsed.fontSize)) {
          return parsed.fontSize as FontSizeScale;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS.fontSize;
  });

  const [contrastTheme, setContrastThemeState] = useState<ContrastTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.contrastTheme && ['normal', 'high-contrast-light', 'high-contrast-dark', 'dark-maroon'].includes(parsed.contrastTheme)) {
          return parsed.contrastTheme as ContrastTheme;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS.contrastTheme;
  });

  // Apply font size and contrast changes to the root DOM document
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = FONT_SIZE_SCALES[fontSize];
    root.setAttribute('data-font-size', fontSize);

    // Update contrast classes
    root.classList.remove('high-contrast-light', 'high-contrast-dark', 'theme-dark-maroon');
    if (contrastTheme === 'high-contrast-light') {
      root.classList.add('high-contrast-light');
    } else if (contrastTheme === 'high-contrast-dark') {
      root.classList.add('high-contrast-dark');
    } else if (contrastTheme === 'dark-maroon') {
      root.classList.add('theme-dark-maroon');
    }

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize, contrastTheme }));
    } catch {
      // ignore storage issues
    }
  }, [fontSize, contrastTheme]);

  const setFontSize = useCallback((size: FontSizeScale) => {
    setFontSizeState(size);
  }, []);

  const setContrastTheme = useCallback((theme: ContrastTheme) => {
    setContrastThemeState(theme);
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontSizeState((prev) => {
      if (prev === 'small') return 'normal';
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return prev;
    });
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSizeState((prev) => {
      if (prev === 'xlarge') return 'large';
      if (prev === 'large') return 'normal';
      if (prev === 'normal') return 'small';
      return prev;
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    setContrastThemeState((prev) => (prev === 'normal' ? 'high-contrast-light' : 'normal'));
  }, []);

  const resetAccessibility = useCallback(() => {
    setFontSizeState(DEFAULT_SETTINGS.fontSize);
    setContrastThemeState(DEFAULT_SETTINGS.contrastTheme);
  }, []);

  const isHighContrast = contrastTheme !== 'normal';

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        contrastTheme,
        setFontSize,
        setContrastTheme,
        increaseFontSize,
        decreaseFontSize,
        toggleHighContrast,
        resetAccessibility,
        isHighContrast
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
