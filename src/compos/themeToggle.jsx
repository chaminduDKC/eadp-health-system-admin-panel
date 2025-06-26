import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/theme.css'
import './theme-toggle.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
          <i className="fa-regular fa-moon theme"></i>
      ) : (
          <i className="fa-regular fa-sun theme"></i>
      )}
    </button>
  );
}