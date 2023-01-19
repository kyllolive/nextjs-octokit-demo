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
import React from "react";
import { useRouter } from "next/router";
import { Language } from "../../components/Language/Language";
import randomWords from "random-words";

const MyOctokit = Octokit.plugin(createPullRequest);

const octokit = new MyOctokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export const HomeTest = (props) => {
  const ROWS_PER_PAGE = 10;
  const { translations, sourceLanguage, commonPaths, nonCommonPaths } = props;
  const { query, push } = useRouter();
  const languageID = query.languageID as string;
  const [rowsPerPage] = React.useState(ROWS_PER_PAGE);
  const [page, setPage] = React.useState<number>(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchField, setSearchField] = React.useState("");
  const [items, setItems] = React.useState([
    { path: "", content: "", key: "", contentFromGH: "" },
  ]);

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

  const handleSubmitOctokit = async () => {
    setIsLoading(true);
    const files = prepareFiles(items);
    if (files) {
      let prObject;
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
      }

      const pr = await octokit.createPullRequest({
        owner: "kyllolive",
        repo: "nextjs-octokit-demo",
        title: `update translations ${moment().format(
          "MMMM Do YYYY, h:mm:ss a"
        )} `,
        body: "Update translation",
        head: `update-translation-${randomWords(3).join("")}`,
        base: "main",
        update: false,
        changes: [
          {
            files: prObject,
            commit: `update translations ${moment().format(
              "MMMM Do YYYY, h:mm:ss a"
            )} `,
          },
        ],
      });

      if (pr.status === 201) {
        setIsLoading(false);
        alert("Pull request created successfully");
        push("/");
        return pr;
      }
    }
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
                      getCommonPaths
                      nonCommonPaths
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
                    source={sourceLanguage[item]}
                    translationValue={translations[item]}
                    translationKey={item}
                    handleNewItem={handleNewItem}
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
