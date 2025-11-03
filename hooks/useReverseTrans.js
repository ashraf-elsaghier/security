import { i18n } from "next-i18next";

// Reverse translation function
const useReverseTranslate = (text) => {
  const currentLanguage = i18n.language;

  const translations = i18n.getResourceBundle(currentLanguage, "Table");

  const reverseTranslations = Object.entries(translations).reduce(
    (acc, [key, value]) => {
      acc[value] = key;
      return acc;
    },
    {}
  );

  return reverseTranslations[text] || text;
};

export default useReverseTranslate;
