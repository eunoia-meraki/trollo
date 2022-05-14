import i18n from 'i18next';

interface ILanguage {
  key: string;
  text: string;
}

interface IUseLanguage {
  languages: () => ILanguage[];
  setLanguage: (language: string) => void;
}

export const useLanguage = (): IUseLanguage => {
  const setLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const languages = () => {
    const langs: ILanguage[] = [
      { key: 'ru', text: 'Русский' },
      { key: 'en', text: 'English' },
    ];
    return langs;
  };

  return { languages, setLanguage };
};
