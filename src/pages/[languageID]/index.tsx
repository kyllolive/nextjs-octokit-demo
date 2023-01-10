import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { locales } from "../../translations/config";
import {
  getLocalizationProps,
  LanguageProvider,
} from "../../context/language.context";
import { Localization } from "../../translations/types";
import { Home } from "../../containers/Home/Home";

export interface IHomePageProps {
  localization?: Localization;
}

const HomePage: NextPage<IHomePageProps> = ({ localization }) => {
  // const strings = typeof localization?.translations;

  return (
    <>
      {/* <LanguageProvider localization={localization}>
        <Home />
      </LanguageProvider> */}
      <Home translations={localization?.translations} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const localization = getLocalizationProps(
    ctx.params?.languageID as string,
    "home"
  );

  return {
    props: {
      localization,
    },
    revalidate: 20,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: locales.map((languageID) => ({ params: { languageID } })),
    fallback: false,
  };
};

export default HomePage;
