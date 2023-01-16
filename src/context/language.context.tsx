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

export const getAllLocalization = (languageID: string) => {
  const lang: Locale = langLocales.includes(languageID as Locale)
    ? (languageID as Locale)
    : "en";

  let translations = {};
  let locale = locales[lang];
  let localeNamespace = Object.keys(locale);

  localeNamespace.forEach((namespace) => {
    const strings = locale[namespace];

    translations = { ...translations, ...strings };
  });

  return {
    locale: lang || "en",
    translations,
    namespace: "all",
  };
};

export const getUniqueProperties = (languageID: string) => {
  const lang: Locale = langLocales.includes(languageID as Locale)
    ? (languageID as Locale)
    : "en";

  let translations = {};
  let locale = locales[lang];
  let localeNamespace = Object.keys(locale);

  localeNamespace.forEach((namespace) => {
    const strings = locale[namespace];

    Object.assign(translations, strings);
  });

  // console.log("translations", translations);

  return {
    locale: lang || "en",
    translations,
    namespace: "all",
  };
};
// for (let i = 0; i < localeNamespace.length; i++) {
//   const strings = locale[localeNamespace[i]];
//   if (i === 0) {
//     current = strings
//   } else {
//     current = {...current, ...strings}

//   }

//   console.log("im strings", strings);
//   // Object.entries(strings).forEach(([key, value]) => combined.set(key, value));

//   //check current property and previous property for duplicate properties
//   // if (i > 0) {
//   //   const prevStrings = locale[localeNamespace[i - 1]];
//   //   const prevKeys = Object.keys(prevStrings);
//   //   const currentKeys = Object.keys(strings);
//   //   const duplicateKeys = prevKeys.filter((key) => currentKeys.includes(key));
//   //   console.log("duplicateKeys", duplicateKeys);
//   // }
// }

// const entries = Array.from(combined.entries());

// console.log("entries", combined.values());
// remove duplicate keys from commonStrings and add to nonCommonStrings
// for (const key in commonStrings) {
//   if (commonStrings.hasOwnProperty(key)) {
//     if (nonCommonStrings && nonCommonStrings.hasOwnProperty(key)) {
//       // delete commonStrings[key];
//     } else {
//       nonCommonStrings = { ...nonCommonStrings, [key]: commonStrings[key] };
//     }
//   }
// }

// console.log("commonStrings", commonStrings);

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
