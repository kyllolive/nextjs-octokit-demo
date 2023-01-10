import { useEffect } from "react";
import { LANGUAGES } from "../constants/language.constants";
import { useRouter } from "next/router";
// import { useAuthState } from "@contexts/auth.context";

const RootPage = () => {
  const { replace } = useRouter();
  // const { user } = useAuthState();
  useEffect(() => {
    const preferredLanguage = localStorage.getItem("preferredLang");

    if (preferredLanguage === navigator.language.split(/-|_/)[0]) {
      replace(`/[languageID]`, `/${preferredLanguage}`);
      return;
    } else {
      const browserLang = getBrowserLocales({ languageCodeOnly: true });
      if (browserLang) {
        for (const lang of LANGUAGES) {
          if (lang.languageID === browserLang[0]) {
            localStorage.setItem("preferredLang", browserLang[0]);
            replace(`/[languageID]`, `/${browserLang[0]}`);
            return;
          }
        }
      }
      localStorage.setItem("preferredLang", LANGUAGES[0].languageID);
      replace(`/[languageID]`, `/${LANGUAGES[0].languageID}`);
    }
  }, []);

  return;
};

const getBrowserLocales = (options = {}) => {
  const defaultOptions = {
    languageCodeOnly: false,
  };

  const opt = {
    ...defaultOptions,
    ...options,
  };

  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages;

  if (!browserLocales) {
    return undefined;
  }

  return browserLocales.map((locale) => {
    const trimmedLocale = locale.trim();

    return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale;
  });
};

export default RootPage;
