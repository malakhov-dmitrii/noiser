import { useState } from 'react';

export type ThemeType = 'light' | 'dark' | 'system' | 'gradient';

const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType>((localStorage.getItem('theme') as ThemeType) || 'gradient');

  const toggle = (type: ThemeType) => {
    setTheme(type);
    localStorage.setItem('theme', type);
  };
  return { toggle, theme };
};

export default useTheme;
