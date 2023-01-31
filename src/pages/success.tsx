import React, { useEffect, useState } from "react";
import { CircularProgress, Card, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { LANGUAGES } from "../constants/language.constants";

const SuccessPage: React.FC = () => {
  const { query, push, replace } = useRouter();

  const getToken = async () => {
    const result = await fetch(
      "https://bdvurcsufqllc2h5ugdehmifli0hsxho.lambda-url.ap-northeast-1.on.aws/",
      {
        method: "POST",
        headers: {
          origin: "localhost:3000",
          "Access-Control-Request-Method": "POST",
        },

        body: JSON.stringify({
          code: query.code,
        }),
      }
    );

    const data = await result.json();

    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      replace(`/[languageID]`, `/${LANGUAGES[0].languageID}`);
    }
  };

  useEffect(() => {
    if (query.code) {
      getToken();
    }

    // push to home page
  }, [query]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card style={{ padding: "1rem", textAlign: "center" }}>
        <Typography variant="h5">Verification Successful!</Typography>
        <Typography>Thank you for verifying your account.</Typography>
        <CircularProgress />
        <Typography>Redirecting to home...</Typography>
      </Card>
    </div>
  );
};

export default SuccessPage;
