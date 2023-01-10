export const TRANSLATION_LANGUAGE: {
  [key: string]: { id: string; name: string };
} = {
  en: {
    id: "en",
    name: "English",
  },
  fil: {
    id: "fil",
    name: "Filipino",
  },
  ja: {
    id: "ja",
    name: "日本語",
  },
  fr: {
    id: "fr",
    name: "Français",
  },
  zh: {
    id: "zh",
    name: "中文 (繁體)",
  },
  es: {
    id: "es",
    name: "Español",
  },
  ko: {
    id: "ko",
    name: "한국어",
  },
  ceb: {
    id: "ceb",
    name: "Cebuano",
  },
  hi: {
    id: "hi",
    name: "Hindi",
  },
  mr: {
    id: "mr",
    name: "Marathi",
  },
  id: {
    id: "id",
    name: "Bahasa Indonesia",
  },
};
export const GET_LANG_NAME: { [key: string]: string } = Object.values(
  TRANSLATION_LANGUAGE
).reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});

export const LANGUAGES: { languageID: string; name: string }[] = Object.values(
  TRANSLATION_LANGUAGE
).map((lang) => Object.assign({}, { languageID: lang.id, name: lang.name }));
