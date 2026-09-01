import React, { createContext, useContext, useState } from 'react';
import { translations } from '../utils/translations';
import { SUPPORTED_LANGUAGES } from '../utils/constants';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('civic_lang') || 'en');

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('civic_lang', newLang);
  };

  const t = (key) => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
