import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setDarkMode] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme ? JSON.parse(storedTheme) : false;
    });

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(isDarkMode));
        document.body.style.backgroundColor = isDarkMode
            ? '#1F2937'
            : '#F3F4F6';
        document.body.style.color = isDarkMode ? '#E5E7EB' : '#111827';
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    const themeStyles = {
        background: isDarkMode ? '#1F2937' : '#F3F4F6',
        text: isDarkMode ? '#E5E7EB' : '#111827',
        primaryButton: isDarkMode ? '#60A5FA' : '#3B82F6',
        accent: '#10B981',
    };

    return (
        <ThemeContext.Provider
            value={{ isDarkMode, toggleDarkMode, themeStyles }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
