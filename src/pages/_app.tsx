import { LanguageModalProvider } from "../context/language.context";
export default function App({ Component, pageProps }) {
  return (
    <LanguageModalProvider>
      <Component {...pageProps} />
    </LanguageModalProvider>
  );
}
