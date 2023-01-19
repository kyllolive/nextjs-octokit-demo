import React from "react";
import { useRouter } from "next/router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { isLocale, Localization, Locale } from "../translations/types";
import defaultStrings from "../translations/locales/en";
import locales from "../translations/locales";
import { locales as langLocales } from "../translations/config";
import { INIT_LOCALIZATION } from "../translations/constant";
import { Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";

const MyOctokit = Octokit.plugin(createPullRequest);

const octokit = new MyOctokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});
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

export const getNonCommonPaths = async (nonCommonPaths, languageID: string) => {
  const lang: Locale = langLocales.includes(languageID as Locale)
    ? (languageID as Locale)
    : "en";

  let nonCommons;

  for (const key in nonCommonPaths) {
    //check if nonCommon[key] exist in target lang
    const filePath = `src/translations/locales/${lang}/${nonCommonPaths[key]}`;

    const imports = await import(
      `src/translations/locales/${lang}/${nonCommonPaths[key]}`
    );

    const strings = imports.default;

    for (let string in strings) {
      nonCommons = { ...nonCommons, [string]: filePath };
    }
  }

  return {
    nonCommons,
  };
};

export const getCommonPaths = async (commonPaths, languageID: string) => {
  const lang: Locale = langLocales.includes(languageID as Locale)
    ? (languageID as Locale)
    : "en";

  let commons;

  for (const key in commonPaths) {
    const filePath = `src/translations/locales/${lang}/${commonPaths[key]}`;
    const imports = await import(
      `src/translations/locales/${lang}/${commonPaths[key]}`
    );
    const strings = imports.default;

    for (let string in strings) {
      commons = { ...commons, [string]: filePath };
    }
  }
  return {
    commons,
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
