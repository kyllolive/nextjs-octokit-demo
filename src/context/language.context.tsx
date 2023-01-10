import React from "react";
import { useRouter } from "next/router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { isLocale, Localization, Locale } from "../translations/types";
import defaultStrings from "../translations/locales/en";
import locales from "../translations/locales";
import { locales as langLocales } from "../translations/config";
import { INIT_LOCALIZATION } from "../translations/constant";

/**
 * Language Context
 */

// interface ContextProps {
//   readonly localization: Localization;
//   readonly setLocale: (localization: Localization) => void;
// }

export const LanguageContext = React.createContext<any>({
  localization: {
    locale: "en", // default lang
    translations: defaultStrings.home, // default translations TODO: what to do here?
    namespace: "home", // default namespace TODO: could we null this? 'common' might be misleading
  },
  setLocale: () => null,
});

/**
 * Language Context: Provider
 */

export const LanguageProvider = ({
  localization = INIT_LOCALIZATION,
  children,
}) => {
  const [localizationState, setLocalizationState] = React.useState({
    locale: localization?.locale,
    translations: localization?.translations,
    namespace: localization?.namespace,
  });
  const [getStoredLocale, setStoredLocale] = useLocalStorage("locale");
  const { query } = useRouter();
  React.useEffect(() => {
    if (localizationState.locale !== getStoredLocale) {
      setStoredLocale(localizationState.locale);
    }
  }, [localizationState]);

  React.useEffect(() => {
    if (
      typeof query.lang === "string" &&
      isLocale(query.lang) &&
      localization?.locale !== query.lang
    ) {
      setLocalizationState({
        locale: localization?.locale,
        translations: localization?.translations,
        namespace: localization?.namespace,
      });
    }
  }, [query.lang, localizationState]);

  return (
    <LanguageContext.Provider
      value={{ localization, setLocale: setLocalizationState }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const getLocalizationProps = (languageID: string, namespace: string) => {
  const lang: Locale = langLocales.includes(languageID as Locale)
    ? (languageID as Locale)
    : "en";
  const locale: any = locales[lang];
  const strings: any = locale[namespace];
  const translations = {
    ...strings,
  };
  return {
    locale: lang || "en",
    translations,
    namespace,
  };
};

export const LanguageSettingsContext = React.createContext(null as any);

export const LanguageModalProvider = ({ children }) => {
  const [isLanguageModalOpen, setIsLanguageModalOpen] = React.useState(false);

  return (
    <LanguageSettingsContext.Provider
      value={{ isLanguageModalOpen, setIsLanguageModalOpen }}
    >
      {children}
    </LanguageSettingsContext.Provider>
  );
};
