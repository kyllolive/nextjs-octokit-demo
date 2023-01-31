import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Grid,
  Pagination,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import { ItemTest } from "../../components/Items/ItemTest";
import { Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import { octokitConstants } from "../../constants/octokit.constants";
import { useRouter } from "next/router";
import { Language } from "../../components/Language/Language";
import randomWords from "random-words";
import axios from "axios";

const MyOctokit = Octokit.plugin(createPullRequest);

const octokit = new MyOctokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export const HomeTest = (props) => {
  const ROWS_PER_PAGE = 10;
  const { translations, sourceLanguage, commonPaths, nonCommonPaths, token } =
    props;
  const { query, push } = useRouter();
  const languageID = query.languageID as string;
  const [rowsPerPage] = React.useState(ROWS_PER_PAGE);
  const [page, setPage] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchField, setSearchField] = React.useState("");
  const [items, setItems] = React.useState([
    { path: "", content: "", key: "", contentFromGH: "" },
  ]);

  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  const baseURL = "https://api.github.com";

  const searchString = Object.keys(translations).filter((key) => {
    return translations[key].toLowerCase().includes(searchField.toLowerCase());
  });

  const getItemPaths = (item) => {
    if (commonPaths[item] && !nonCommonPaths[item]) {
      return commonPaths[item];
    } else if (!commonPaths[item] && nonCommonPaths[item]) {
      return nonCommonPaths[item];
    } else if (commonPaths[item] && nonCommonPaths[item]) {
      return commonPaths[item];
    } else {
      return null;
    }
  };

  const handleNewItem = async (item) => {
    // replace item if it already exists
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const index = newItems.findIndex((i) => i.key === item.key);
      if (index !== -1) {
        newItems[index] = item;
      } else {
        newItems.push(item);
      }
      return newItems;
    });
  };

  const handlePageChange = (_event: any, page: number) => {
    setPage(page);
  };

  const prepareFiles = (items) => {
    const files = {};
    items.forEach((file) => {
      if (file.path !== "") {
        if (!files[file.path]) {
          files[file.path] = {
            content: { [file.key]: file.content },
            source: file.contentFromGH,
          };
        } else {
          files[file.path].content[file.key] = file.content;
        }
      }
    });
    return files;
  };

  // function to get the SHA of the base branch
  const getBaseBranchSha = async (owner, repo, baseBranch) => {
    try {
      const response = await axios.get(
        `${baseURL}/repos/${owner}/${repo}/branches/${baseBranch}`
      );
      return response.data.commit.sha;
    } catch (error) {
      console.error(error);
    }
  };

  // function to update files
  const updateFiles = async (owner, repo, branch, files, baseBranchSha) => {
    try {
      const promises = files.map(async ({ path, content }) => {
        const response = await axios.put(
          `${baseURL}/repos/${owner}/${repo}/contents/${path}`,
          {
            message: `Update ${path}`,
            content: content,
            branch,
            sha: baseBranchSha,
          }
        );
        return response.data;
      });
      return await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  };

  const createPullRequest = async (owner, repo, title, body, head, base) => {
    try {
      const response = await axios.post(
        `${baseURL}/repos/${owner}/${repo}/pulls`,
        {
          title,
          body,
          head,
          base,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const main = async (files) => {
    const owner = octokitConstants.owner;
    const repo = octokitConstants.repo;
    const baseBranch = "main";
    const title = "Update translations";
    const body = "Updating the translations files";

    // create axios instance with necessary authentication header
    const instance = axios.create({
      headers: {
        Authorization: `Token ${GITHUB_TOKEN}`,
      },
    });

    // get the SHA of the base branch
    const baseBranchSha = await getBaseBranchSha(owner, repo, baseBranch);

    // generate a unique branch name
    const branch = `update-translations-${Date.now()}`;

    // create a new branch
    const newBranch = await instance.post(
      `${baseURL}/repos/${owner}/${repo}/git/refs`,
      {
        ref: `refs/heads/${branch}`,
        sha: baseBranchSha,
      }
    );

    console.log("New branch created: ", newBranch.data);

    // update the files in the new branch
    const updatedFiles = await updateFiles(
      owner,
      repo,
      branch,
      files,
      baseBranchSha
    );

    console.log("Updated files: ", updatedFiles);

    // create a pull request
    const pullRequest = await createPullRequest(
      owner,
      repo,
      title,
      body,
      branch,
      baseBranch
    );

    console.log("Pull request created: ");
  };

  const handleSubmitOctokit = async () => {
    setIsLoading(true);
    const files = prepareFiles(items);
    let prArr = [];
    let prObject;
    if (files) {
      for (const key in files) {
        const path = key;
        const item = files[key];
        const content = Object.keys(item.content);
        let source = item.source;

        content.forEach((key) => {
          const input = `${key}: '${item.content[key]}'`;
          const keyName = input.match(/^.*:/)[0].replace(":", "").trim();
          const newValue = input.match(/'.*'$/)[0].replace(/'/g, "");
          const regex = new RegExp(`(${keyName}): '(.*)'`);

          source = source.replace(regex, `$1: '${newValue}'`);
        });

        const updatedContent = Buffer.from(source).toString("utf-8");

        prObject = {
          ...prObject,
          [path]: updatedContent,
        };
        prArr.push({
          path: path,
          content: updatedContent,
        });
      }
    }

    console.log("prArr", prArr);

    const result = await main(prArr);

    console.log("result", result);
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box my={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
              >
                Welcome to Epico Site Translations
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Box>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            // padding: 30,
          }}
        >
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {languageID && (
              <Box>
                <Language />
              </Box>
            )}
          </Box>
        </Box>

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: 30,
          }}
        >
          <TextField
            value={searchField}
            onChange={(e) => {
              setSearchField(e.target.value);
            }}
            placeholder="Search by word in current language"
            style={{
              width: "50%",
            }}
          />
        </Box>

        <Container>
          <Grid container>
            <Grid item xs={6}>
              <Typography
                gutterBottom
                align="center"
                style={{
                  margin: "2rem",
                  fontWeight: "bold",
                }}
              >
                {"Original Text in English "}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                gutterBottom
                align="center"
                style={{
                  margin: "2rem",
                  fontWeight: "bold",
                }}
              >
                {`Current Text in ${languageID.toUpperCase()}`}
              </Typography>
            </Grid>
          </Grid>
          {searchField === "" &&
            Object.keys(translations)
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((key, i) => (
                <Grid container spacing={2} key={i}>
                  <Grid item xs={12}>
                    <ItemTest
                      octokit={octokit}
                      source={sourceLanguage[key]}
                      translationValue={translations[key]}
                      translationKey={key}
                      handleNewItem={handleNewItem}
                      getItemPaths={getItemPaths}
                    />
                  </Grid>
                </Grid>
              ))}
          {searchField !== "" &&
            searchString.map((item, i) => (
              <Grid container spacing={2} key={i}>
                <Grid item xs={12}>
                  <ItemTest
                    octokit={octokit}
                    source={sourceLanguage[item]}
                    translationValue={translations[item]}
                    translationKey={item}
                    handleNewItem={handleNewItem}
                    getItemPaths={getItemPaths}
                  />
                </Grid>
              </Grid>
            ))}
        </Container>

        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button onClick={handleSubmitOctokit}>Save Changes</Button>
          )}
        </Box>
        <Box style={{ textAlign: "center", padding: 30 }}>
          <Pagination
            count={Math.ceil(Object.keys(translations).length / ROWS_PER_PAGE)}
            page={page}
            onChange={handlePageChange}
            style={{ display: "inline-block" }}
          />
        </Box>
      </Box>
    </>
  );
};
