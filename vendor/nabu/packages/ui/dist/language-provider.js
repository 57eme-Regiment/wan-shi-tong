import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LanguageContext = createContext(undefined);
export function LanguageProvider({ children, dictionaries, defaultLanguage = 'en', storageKey = 'app-language', }) {
    const [language, setLanguageState] = useState(() => localStorage.getItem(storageKey) || defaultLanguage);
    const setLanguage = (lang) => {
        localStorage.setItem(storageKey, lang);
        setLanguageState(lang);
    };
    const t = (key) => (dictionaries[language]?.[key] ?? String(key));
    return (_jsx(LanguageContext.Provider, { value: { language, setLanguage, t }, children: children }));
}
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context)
        throw new Error('useLanguage must be used within a LanguageProvider');
    return context;
}
