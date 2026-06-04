import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from './components/button.js';
import { useLanguage } from './language-provider.js';
export function LanguageToggle({ languages = ['en', 'fr'] }) {
    const { language, setLanguage } = useLanguage();
    const currentIndex = languages.indexOf(language);
    const next = languages[(currentIndex + 1) % languages.length] ?? languages[0];
    return (_jsx(Button, { variant: "outline", size: "icon", onClick: () => setLanguage(next), title: `Switch to ${next?.toUpperCase()}`, className: "font-bold whitespace-nowrap", children: language.toUpperCase() }));
}
