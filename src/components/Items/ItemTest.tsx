import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import EdiText from "react-editext";
import React, { useEffect, useState } from "react";
import { Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";

const MyOctokit = Octokit.plugin(createPullRequest);

const octokit = new MyOctokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

const StyledEditText = styled(EdiText)(() => ({
  "& button": {
    borderRadius: "5px",

    "&[editext='edit-button']": {
      // border: "1px solid blue",
    },
  },
  "& input": {
    // border: "1px solid pink",
    fontSize: "100rem",
  },
  "& div": {
    "&[editext='view-container'] ": {
      // border: "1px solid red",
      // width: "150px",
    },
    "&[editext='edit-container'] ": {
      // border: "1px solid blue",
    },
    "&[editext='main-container'] ": {
      // border: "1px solid red",
    },
  },
}));

export const ItemTest = (props) => {
  const {
    handleNewItem,
    source,
    translationValue,
    translationKey,
    getItemPaths,
  } = props;

  const [newText, setNewText] = React.useState<string>("");
  const [keyName, setKeyName] = React.useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNewText(translationValue);
    setKeyName(translationKey);
  }, [translationKey, translationValue]);

  const handleSave = async (event) => {
    if (event === newText) return;
    const input = `${keyName}: '${event}'`;
    const newValue = input.match(/'.*'$/)[0].replace(/'/g, "");
    const path = getItemPaths(keyName);
    setIsLoading(true);
    setNewText(event);

    const getContent = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "kyllolive",
        repo: "nextjs-octokit-demo",
        path: path,
      }
    );

    if (getContent.status === 200) {
      const content = Buffer.from(
        getContent.data["content"],
        "base64"
      ).toString("utf-8");

      handleNewItem({
        path: path,
        content: newValue,
        key: keyName,
        contentFromGH: content,
      });
      setIsLoading(false);
    }
  };
  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box margin={"1rem"}>
              <Typography
                gutterBottom
                align="center"
                style={{
                  fontSize: "1rem",
                  fontFamily: "monospace",
                }}
              >
                {source}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              style={{
                margin: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!isLoading && (
                <Box
                  style={{
                    width: "300px",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <StyledEditText
                    editOnViewClick={true}
                    submitOnEnter
                    cancelOnEscape
                    submitOnUnfocus
                    startEditingOnFocus
                    viewProps={{
                      style: {
                        outline: "none",
                        minWidth: "150px",
                        fontSize: "1rem",
                        fontFamily: "monospace",
                      },
                    }}
                    inputProps={{
                      style: {
                        outline: "none",
                        minWidth: "150px",
                      },
                      rows: 4,
                    }}
                    type="textarea"
                    value={newText}
                    onSave={(event) => {
                      handleSave(event);
                    }}
                  />
                </Box>
              )}
              {isLoading && <CircularProgress />}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
