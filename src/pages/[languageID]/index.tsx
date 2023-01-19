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
  uniqueProperties?: any;
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
  const commonFiles = [
    "commons/authModal.ts",
    "commons/common.ts",
    "commons/deleteDialog.ts",
    "commons/donationBox.ts",
    "commons/followButton.ts",
    "commons/genres.ts",
    "commons/imageUploader.ts",
    "commons/landingPage.ts",
    "commons/seriesDrawer.ts",
    "commons/seriesFooter.ts",
    "commons/seriesReader.ts",
    "commons/tagForm.ts",
    "commons/topNav.ts",
  ];

  const nonCommonFiles = [
    "about.ts",
    "account.ts",
    "consoleChapterList.ts",
    "consoleCreateChapter.ts",
    "consoleCreateSeries.ts",
    "consoleEditChapter.ts",
    "consoleEditSeries.ts",
    "consoleSeriesList.ts",
    "dashboard.ts",
    "genre.ts",
    "home.ts",
    "profile.ts",
    "search.ts",
    "settings.ts",
    "support.ts",
    "translate.ts",
    "viewChapter.ts",
    "viewChapters.ts",
  ];

  const sourceLanguage = getAllLocalization("en");

  const allLocalization = getAllLocalization(ctx.params?.languageID as string);

  const commonPaths = await getCommonPaths(
    commonFiles,
    ctx.params?.languageID as string
  );

  const nonCommonPaths = await getNonCommonPaths(
    nonCommonFiles,
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
