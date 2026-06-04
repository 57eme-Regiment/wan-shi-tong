import { Button } from './components/button.js';
import { useLanguage } from './language-provider.js';

export function LanguageToggle({ languages = ['en', 'fr'] }: { languages?: string[] }) {
  const { language, setLanguage } = useLanguage();
  const currentIndex = languages.indexOf(language);
  const next = languages[(currentIndex + 1) % languages.length] ?? languages[0];

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setLanguage(next)}
      title={`Switch to ${next?.toUpperCase()}`}
      className="font-bold whitespace-nowrap"
    >
      {language.toUpperCase()}
    </Button>
  );
}
