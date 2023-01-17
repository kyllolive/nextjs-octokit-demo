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
  githubfiles?: any;
}

const HomePage: NextPage<IHomePageProps> = ({
  localization,
  sourceLanguage,
  commonFiles,
  nonCommonFiles,
  githubfiles,
}) => {
  // const strings = typeof localization?.translations;

  return (
    <>
      {/* <LanguageProvider localization={localization}>
        <Home />
      </LanguageProvider> */}
      <Home
        githubfiles={githubfiles}
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
  let fileContent;

  const sourceLanguage = getAllLocalization("en");

  const allLocalization = getAllLocalization(ctx.params?.languageID as string);

  const uniqueProperties = getUniqueProperties("en");

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

  const githubfiles = [...commonFiles, ...nonCommonFiles];

  if (githubfiles.length > 0) {
    githubfiles.map((file) => {
      console.log("file", file);
    });
  }
  return {
    props: {
      commonFiles,
      nonCommonFiles,
      localization: allLocalization,
      sourceLanguage,
      githubfiles,
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
