import React from 'react';
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
export declare function LanguageProvider<T extends Record<string, string>>({ children, dictionaries, defaultLanguage, storageKey, }: LanguageProviderProps<T>): React.JSX.Element;
export declare function useLanguage<T extends Record<string, string>>(): LanguageContextType<T>;
export {};
//# sourceMappingURL=language-provider.d.ts.map