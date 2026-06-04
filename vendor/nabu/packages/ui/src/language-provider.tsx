import React, { createContext, useContext, useState } from 'react';

type Language = string;

interface LanguageContextType<T extends Record<string, string>> {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof T) => string;
}

interface LanguageProviderProps<T extends Record<string, string>> {
  children: React.ReactNode;
  dictionaries: Record<Language, T>;
  defaultLanguage?: Language;
  storageKey?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LanguageContext = createContext<LanguageContextType<Record<string, string>> | undefined>(undefined);

export function LanguageProvider<T extends Record<string, string>>({
  children,
  dictionaries,
  defaultLanguage = 'en',
  storageKey = 'app-language',
}: LanguageProviderProps<T>) {
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage,
  );

  const setLanguage = (lang: Language) => {
    localStorage.setItem(storageKey, lang);
    setLanguageState(lang);
  };

  const t = (key: keyof T): string =>
    (dictionaries[language]?.[key] ?? String(key)) as string;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage<T extends Record<string, string>>() {
  const context = useContext(LanguageContext) as LanguageContextType<T> | undefined;
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
