import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// import { makeStyles } from "@mui/styles";
import EdiText from "react-editext";
import React, { useEffect, useState } from "react";
import { Item } from "./Item";
import { Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";
const MyOctokit = Octokit.plugin(createPullRequest);

const octokit = new MyOctokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

// const useStyles = makeStyles(() => ({
//   textArea: {
//     "& button": {
//       // border: "1px solid blue",
//     },
//     "& input": {
//       // border: "1px solid pink",
//     },
//     "& div": {
//       "&[editext='view-container'] ": {
//         border: "1px solid red",
//       },
//       "&[editext='edit-container'] ": {
//         border: "1px solid blue",
//       },
//     },
//   },
// }));

const StyledEditText = styled(EdiText)(() => ({
  "& button": {
    // border: "1px solid blue",
  },
  "& input": {
    // border: "1px solid pink",
  },
  "& div": {
    "&[editext='view-container'] ": {
      border: "1px solid red",
    },
    "&[editext='edit-container'] ": {
      border: "1px solid blue",
    },
  },
}));

export const ItemTest = (props) => {
  // const classes = useStyles();

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

    console.log("getContent", getContent);

    const content = Buffer.from(getContent.data["content"], "base64").toString(
      "utf-8"
    );

    handleNewItem({
      path: path,
      content: newValue,
      key: keyName,
      contentFromGH: content,
    });
    setIsLoading(false);
  };
  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box margin={"1rem"}>
              <Typography gutterBottom align="center">
                {source}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              style={{
                margin: "1rem",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Typography gutterBottom align="center">
                {translationValue}
              </Typography> */}
              {!isLoading && (
                <StyledEditText
                  // className={classes.textArea}
                  value={newText}
                  type="text"
                  onSave={(event) => {
                    handleSave(event);
                  }}
                />
              )}
              {isLoading && <CircularProgress />}
            </Box>
          </Grid>
          {/* <Grid item xs={4}>
          <Box style={{ margin: "1rem" }}>
            <TextField
              id="outlined-basic"
              label="Your Translation"
              variant="outlined"
              value={newText}
              type="text"
              onChange={(event) => {
                setNewText(event.target.value);
                // handleNewItem({
                //   translationKey: keyName,
                //   translationValue: event.target.value,
                // })
              }}
            />
          </Box>
        </Grid> */}
        </Grid>
        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button variant="outlined" onClick={handleClick}>
            Confirm
          </Button>
        </div> */}
      </Box>
    </>
  );
};
