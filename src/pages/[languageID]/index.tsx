import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { locales } from "../../translations/config";
import {
  getLocalizationProps,
  LanguageProvider,
  getAllLocalization,
  getUniqueProperties,
} from "../../context/language.context";
import { Localization, SourceLanguage } from "../../translations/types";
import { Home } from "../../containers/Home/Home";
import { Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";

const MyOctokit = Octokit.plugin(createPullRequest);

const octokit = new MyOctokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export interface IHomePageProps {
  localization?: Localization;
  sourceLanguage?: SourceLanguage;
  commonFiles?: any;
  nonCommonFiles?: any;
}

const HomePage: NextPage<IHomePageProps> = ({
  localization,
  sourceLanguage,
  commonFiles,
  nonCommonFiles,
}) => {
  // const strings = typeof localization?.translations;

  return (
    <>
      {/* <LanguageProvider localization={localization}>
        <Home />
      </LanguageProvider> */}
      <Home
        commonFiles={commonFiles}
        nonCommonFiles={nonCommonFiles}
        namespace={localization?.namespace}
        translations={localization?.translations}
        sourceLanguage={sourceLanguage.translations}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  let myTranslations;

  const sourceLanguage = getAllLocalization("en");

  const allLocalization = getAllLocalization(ctx.params?.languageID as string);

  //get all files in translations folder using octokit

  const { data: nonCommonFiles } = await octokit.rest.repos.getContent({
    owner: "kyllolive",
    repo: "nextjs-octokit-demo",
    path: `src/translations/locales/${ctx.params?.languageID}`,
  });

  const { data: commonFiles } = await octokit.rest.repos.getContent({
    owner: "kyllolive",
    repo: "nextjs-octokit-demo",
    path: `src/translations/locales/${ctx.params?.languageID}/commons`,
  });

  if (nonCommonFiles) {
    for (let i = 0; i < nonCommonFiles.length; i++) {
      if (nonCommonFiles[i].name === "commons") return;

      const pathContent = nonCommonFiles[i].path;

      const result = await octokit.rest.repos.getContent({
        owner: "kyllolive",
        repo: "nextjs-octokit-demo",
        path: pathContent,
      });

      const string = Buffer.from(result.data["content"], "base64").toString(
        "utf8"
      );
      console.log(string);
      return;
    }
  }
  return {
    props: {
      commonFiles,
      nonCommonFiles,
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
