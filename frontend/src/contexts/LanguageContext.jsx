import { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import he from '../locales/he.json';

const LanguageContext = createContext();

const translations = {
    en,
    he
};

const rtlLanguages = ['he', 'ar'];

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        const savedLang = localStorage.getItem('language') || 'he';
        // Set initial direction immediately
        document.documentElement.dir = rtlLanguages.includes(savedLang) ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLang;
        return savedLang;
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const t = (key, params = {}) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            value = value?.[k];
        }

        if (!value) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }

        // Replace parameters like {name}, {cost}, etc.
        if (typeof value === 'string') {
            return value.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}