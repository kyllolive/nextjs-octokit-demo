import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { locales } from "../../translations/config";
import {
  getAllLocalization,
  getCommonPaths,
  getNonCommonPaths,
} from "../../context/language.context";
import { Localization, SourceLanguage } from "../../translations/types";
import { HomeTest } from "../../containers/Home/HomeTest";

export interface IHomePageProps {
  localization?: Localization;
  sourceLanguage?: SourceLanguage;
  nonCommonPaths?: any;
  commonPaths?: any;
}

const HomePage: NextPage<IHomePageProps> = ({
  localization,
  sourceLanguage,
  nonCommonPaths,
  commonPaths,
}) => {
  return (
    <>
      <HomeTest
        nonCommonPaths={nonCommonPaths}
        commonPaths={commonPaths}
        translations={localization?.translations}
        sourceLanguage={sourceLanguage.translations}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const sourceLanguage = getAllLocalization("en");

  const allLocalization = getAllLocalization(ctx.params?.languageID as string);

  const commonPaths = await getCommonPaths(ctx.params?.languageID as string);

  const nonCommonPaths = await getNonCommonPaths(
    ctx.params?.languageID as string
  );

  return {
    props: {
      // uniqueProperties,
      commonPaths: commonPaths.commons,
      nonCommonPaths: nonCommonPaths.nonCommons,
      localization: allLocalization,
      sourceLanguage,
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
