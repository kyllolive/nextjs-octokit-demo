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
} from "@mui/material";
import { Item } from "../../components/Items/Item";
import { Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LanguageSettingsContext } from "../../context/language.context";
import { Language } from "../../components/Language/Language";
import { Navigator } from "../../components/Navigator/Navigator";

const MyOctokit = Octokit.plugin(createPullRequest);

const octokit = new MyOctokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export const Home = (props) => {
  const ROWS_PER_PAGE = 10;
  const {
    translations,
    sourceLanguage,
    commonFiles,
    nonCommonFiles,
    githubfiles,
  } = props;
  const { push, pathname, query } = useRouter();
  const languageID = query.languageID as string;
  const [rowsPerPage] = React.useState(ROWS_PER_PAGE);
  const [page, setPage] = React.useState<number>(1);
  const [pullRequestState, setPullRequestState] = useState(false);
  const [searchField, setSearchField] = React.useState("");
  const [items, setItems] = React.useState([
    {
      translationKey: "",
      translationValue: "",
    },
  ]);

  const { setIsLanguageModalOpen } = React.useContext(LanguageSettingsContext);

  const searchString = Object.keys(translations).filter((key) => {
    return translations[key].toLowerCase().includes(searchField.toLowerCase());
  });

  const handleNewItem = async (item) => {
    if (!item.translationKey || !item.translationValue) return;
    // replace item if it already exists

    setItems((prevItems) => {
      const newItems = [...prevItems];
      const index = newItems.findIndex(
        (i) => i.translationKey === item.translationKey
      );
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
  const handleSubmitOctokit = async () => {
    //iterate items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const input = `${item.translationKey}: '${item.translationValue}'`;
      const key = input.match(/^.*:/)[0].replace(":", "").trim();
      const newValue = input.match(/'.*'$/)[0].replace(/'/g, "");
      const regex = new RegExp(`(${key}): '(.*)'`);
      let updatedString;

      commonFiles.forEach(async (file) => {
        const { data: fileContent } = await octokit.rest.repos.getContent({
          owner: "kyllolive",
          repo: "nextjs-octokit-demo",
          path: `${file.path}`,
        });

        const fileContentString = Buffer.from(
          fileContent.content,
          "base64"
        ).toString();

        updatedString = fileContentString.replace(regex, `$1: '${newValue}'`);

        if (updatedString === fileContentString) {
          console.log("no match");
          return;
          // nonCommonFiles.forEach(async (file) => {
          //   const { data: fileContentNonCommon } =
          //     await octokit.rest.repos.getContent({
          //       owner: "kyllolive",
          //       repo: "nextjs-octokit-demo",
          //       path: `${file.path}`,
          //     });

          //   if (!fileContentNonCommon) return;

          //   const fileContentStringNonCommon = Buffer.from(
          //     fileContentNonCommon.content,
          //     "base64"
          //   ).toString();

          //   console.log(fileContentNonCommon);

          //   updatedString = fileContentStringNonCommon.replace(
          //     regex,
          //     `$1: '${newValue}'`
          //   );

          //   if (updatedString === fileContentStringNonCommon) {
          //     console.log("no match");
          //     return;
          //   } else {
          //     // const fileContentBuffer = Buffer.from(updatedString);
          //     // const fileContentBase64 = fileContentBuffer.toString("base64");
          //     const result = await octokit.createPullRequest({
          //       owner: "kyllolive",
          //       repo: "nextjs-octokit-demo",
          //       title: "update translation",
          //       body: "update translation",
          //       head: "update-translation",
          //       update: pullRequestState,
          //       base: "main",
          //       changes: [
          //         {
          //           files: {
          //             [`${file.path}`]: updatedString,
          //           },
          //           commit: "update translation",
          //         },
          //       ],
          //     });
          //     console.log("result", result);
          //     return result;
          //   }
          // });
        }

        // const fileContentBuffer = Buffer.from(updatedString);
        // const fileContentBase64 = fileContentBuffer.toString("base64");

        const result = await octokit.createPullRequest({
          owner: "kyllolive",
          repo: "nextjs-octokit-demo",
          title: "update translation",
          body: "update translation",
          head: "update-translation",
          update: pullRequestState || true,
          base: "main",
          changes: [
            {
              files: {
                [`${file.path}`]: updatedString,
              },
              commit: "update translation",
            },
          ],
        });

        if (result.status === 200) {
          console.log(result);
          return;
        }
      });
    }
  };

  const handleOpenLanguage = () => {
    setIsLanguageModalOpen(true);
  };

  useEffect(() => {
    const fetchPullRequest = async () => {
      const { data: pullRequests } = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls",
        {
          owner: "kyllolive",
          repo: "nextjs-octokit-demo",
          state: "open",
          head: `update-translation`,
        }
      );

      if (pullRequests.state === "open") {
        setPullRequestState(true);
      }
    };
    fetchPullRequest();
  }, []);

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
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {languageID && (
              <Box>
                <Navigator />
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

        <Grid container>
          <Grid item xs={4}>
            <Typography gutterBottom align="center">
              {"Original Text in English "}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom align="center">
              {`Current Text in ${languageID}`}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom align="center">
              {"Your Translation"}
            </Typography>
          </Grid>
        </Grid>
        {/* {searchField === "" &&
          Object.keys(translations)
            .slice((page - 1) * rowsPerPage, page * rowsPerPage)
            .map((key, i) => (
              <Grid container spacing={2} key={i}>
                <Grid item xs={12}>
                  <Item
                    source={sourceLanguage[key]}
                    translationValue={translations[key]}
                    translationKey={key}
                    handleNewItem={handleNewItem}
                  />
                </Grid>
              </Grid>
            ))} */}
        {githubfiles.map((file, i) => (
          <Grid container spacing={2} key={i}></Grid>
        ))}
        {searchField !== "" &&
          searchString.map((item, i) => (
            <Grid container spacing={2} key={i}>
              <Grid item xs={12}>
                <Item
                  source={sourceLanguage[item]}
                  translationValue={translations[item]}
                  translationKey={item}
                  handleNewItem={handleNewItem}
                />
              </Grid>
            </Grid>
          ))}
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
          }}
        >
          <Button onClick={handleSubmitOctokit}>Save Changes</Button>
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
