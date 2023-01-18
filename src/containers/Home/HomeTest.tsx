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
import { ItemTest } from "../../components/Items/ItemTest";
import { Octokit } from "octokit";
import { createPullRequest } from "octokit-plugin-create-pull-request";
import React from "react";
import { useRouter } from "next/router";
import { LanguageSettingsContext } from "../../context/language.context";
import { Language } from "../../components/Language/Language";
import { Navigator } from "../../components/Navigator/Navigator";

const MyOctokit = Octokit.plugin(createPullRequest);

const octokit = new MyOctokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

type Item = {
  path: string;
  content: string;
};

export const HomeTest = (props) => {
  const ROWS_PER_PAGE = 10;
  const { translations, sourceLanguage, commonPaths, nonCommonPaths } = props;
  const { query } = useRouter();
  const languageID = query.languageID as string;
  const [rowsPerPage] = React.useState(ROWS_PER_PAGE);
  const [page, setPage] = React.useState<number>(1);
  const [searchField, setSearchField] = React.useState("");
  const [items, setItems] = React.useState([
    { path: "", content: "", key: "", contentFromGH: "" },
  ]);

  const searchString = Object.keys(translations).filter((key) => {
    return translations[key].toLowerCase().includes(searchField.toLowerCase());
  });

  const getItemPaths = (item) => {
    // console.log(commonPaths);
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
    //[path]: {content}

    //promise.all items to create or update pull requests
    // let updatedString;
    // const input = `${keyName}: '${event}'`;
    // const key = input.match(/^.*:/)[0].replace(":", "").trim();
    // const newValue = input.match(/'.*'$/)[0].replace(/'/g, "");
    // const regex = new RegExp(`(${key}): '(.*)'`);

    // updatedString = content.replace(regex, `$1: '${newValue}'`);
    // const updatedContent = Buffer.from(updatedString).toString("base64");
    const files = prepareFiles(items);

    if (files) {
      // prepare for PR
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

      console.log(prObject);

      const pr = await octokit.createPullRequest({
        owner: "kyllolive",
        repo: "nextjs-octokit-demo",
        title: "Update translation",
        body: "Update translation",
        head: "update-translation",
        base: "main",
        update: true,
        changes: [
          {
            files: prObject,
            commit: "update translations",
          },
        ],
      });

      console.log(pr);
      return pr;
    }
    // const changes = pathNames.map((path) => {
    //   const content = Object.keys(files[path].content);
    //   const source = files[path].source;

    //   content.forEach((key) => {
    //     const input = `${key}: '${files[path].content[key]}'`;
    //     const keyName = input.match(/^.*:/)[0].replace(":", "").trim();
    //     const newValue = input.match(/'.*'$/)[0].replace(/'/g, "");
    //     const regex = new RegExp(`(${keyName}): '(.*)'`);

    //   });
    // });

    // return {
    //   files: {
    //     [path]: files[path].content,
    //   },
    //   commit: "update translations",
    // };

    // const myArr = items.reduce((obj, file) => {
    //   obj[file.path] = file.content;
    //   return obj;
    // }, {});

    // const files = items.map(file => {
    //   const path = file.path
    //   const content = file.content
    //   return {
    //     [path.replace("path:", "")]: content
    //   }
    // })
    // const myObj = items.reduce((obj, file) => {
    //   const path = file.path;
    //   const content = file.content;
    //   obj[path] = content;
    //   // obj[path.replace("path:", "")] = file[path];
    //   // return obj;

    //   return obj;
    // }, {});

    // const { data: pullRequest } = await octokit.createPullRequest({
    //   owner: "kyllolive",
    //   repo: "nextjs-octokit-demo",
    //   title: "update translations",
    //   body: "update translations",
    //   head: "epico-bot",
    //   base: "main",
    //   changes: [
    //     {
    //       files: {},
    //       commit: "update translations",
    //     },
    //   ],
    // });

    // let content;
    // for (const i in items) {
    //   // console.log(items[i]);
    //   const path = getItemPaths(items[i]);
    //   //get file content from github
    //   const result = await octokit.rest.repos.getContent({
    //     owner: "kyllolive",
    //     repo: "nextjs-octokit-demo",
    //     path: path,
    //   });
    // }
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

        <Grid container>
          <Grid item xs={6}>
            <Typography gutterBottom align="center">
              {"Original Text in English "}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography gutterBottom align="center">
              {`Current Text in ${languageID}`}
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
