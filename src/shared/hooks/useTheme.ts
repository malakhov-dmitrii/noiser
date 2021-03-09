import { useState } from "react";

type ThemeType = 'light' | 'dark';

const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType>(localStorage.getItem('theme') as ThemeType || 'light');

  const toggle = () => {
    const v = theme === 'light' ? 'dark' : 'light';
    setTheme(v);
    localStorage.setItem('theme', v);
  }
  return { toggle, theme }
};

export default useTheme;
