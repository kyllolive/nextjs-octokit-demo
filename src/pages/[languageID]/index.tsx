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
import { Dialog, Box, Typography, Button, DialogTitle } from "@mui/material";

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
  //get token from local storage

  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setToken(token);
    }
  }, []);

  function loginWithGithub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" +
        process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
    );
  }

  return (
    <>
      <Dialog open={token ? false : true}>
        <Box maxWidth={500}>
          <DialogTitle>Login with Github</DialogTitle>
          <Typography sx={{ padding: 3 }}>
            We require you to login with Github to make pull requests to the
            repository. Authorize the app to continue.
          </Typography>
          <Box margin={2}>
            <Button
              style={{
                justifyContent: "center",
                display: "flex",
                margin: "auto",
                width: "fit-content",
                padding: "10px 20px",
                backgroundColor: "#000",
                color: "#fff",
              }}
              onClick={loginWithGithub}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Dialog>

      {token && (
        <HomeTest
          token={token}
          nonCommonPaths={nonCommonPaths}
          commonPaths={commonPaths}
          translations={localization?.translations}
          sourceLanguage={sourceLanguage.translations}
        />
      )}
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
