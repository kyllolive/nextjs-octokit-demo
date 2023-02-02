import React, { useEffect } from "react";
import { CircularProgress, Card, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { LANGUAGES } from "../constants/language.constants";
import { useAuth } from "../context/auth.context";

const SuccessPage: React.FC = () => {
  const { query, replace } = useRouter();
  const { setAccessToken } = useAuth();
  const code = query.code as string;

  const getToken = async () => {
    const result = await fetch(
      "https://2oguz22wewtmtye66o37jvph3e0ekshf.lambda-url.ap-northeast-1.on.aws/",
      {
        method: "POST",
        headers: {
          origin: "https://nextjs-octokit-demo.vercel.app/",
          "Access-Control-Request-Method": "POST",
        },
        body: JSON.stringify({
          code,
        }),
      }
    );
    const data = await result.json();
    if (data) {
      console.log("data", data);
      setAccessToken(data.token);
    }
    replace(`/[languageID]`, `/${LANGUAGES[0].languageID}`);
  };

  useEffect(() => {
    if (query.code) {
      getToken();
    }
  }, [query]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Card
        style={{
          padding: "1rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "50%",
          height: "50%",
        }}
      >
        <Typography variant="h5">Verification Successful!</Typography>
        <Typography>Thank you for verifying your account.</Typography>
        <CircularProgress />
        <Typography>Redirecting to home...</Typography>
      </Card>
    </div>
  );
};

export default SuccessPage;
