import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import EdiText from "react-editext";
import React, { useEffect, useState } from "react";
import { octokitConstants } from "../../constants/octokit.constants";
import axios from "axios";

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
    octokit,
    handleNewItem,
    source,
    translationValue,
    translationKey,
    getItemPaths,
  } = props;

  const [newText, setNewText] = React.useState<string>("");
  const [keyName, setKeyName] = React.useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = "https://api.github.com";

  useEffect(() => {
    setNewText(translationValue);
    setKeyName(translationKey);
  }, [translationKey, translationValue]);

  const getContent = async (owner, repo, path) => {
    try {
      const instance = axios.create({
        headers: {
          Accept: "application/vnd.github+json",
        },
      });
      const { data } = await instance.get(
        `${baseURL}/repos/${owner}/${repo}/contents/${path}`
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (event) => {
    if (event === newText) return;
    const input = `${keyName}: '${event}'`;
    const newValue = input.match(/'.*'$/)[0].replace(/'/g, "");
    const path = getItemPaths(keyName);
    setIsLoading(true);
    setNewText(event);

    const getContentData = await getContent(
      octokitConstants.owner,
      octokitConstants.repo,
      path
    );

    if (getContentData.content) {
      const content = Buffer.from(getContentData.content, "base64").toString(
        "utf-8"
      );

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
