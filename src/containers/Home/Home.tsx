import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  Grid,
  Pagination,
  Button,
} from "@mui/material";
import { Item } from "../../components/Items/Item";
import { Octokit } from "octokit";
import React from "react";
import { useRouter } from "next/router";
import { LanguageSettingsContext } from "../../context/language.context";
import { Language } from "../../components/Language/Language";

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export const Home = (props) => {
  const ROWS_PER_PAGE = 10;
  const { translations } = props;
  const { push, pathname, query } = useRouter();
  const languageID = query.languageID as string;
  const [rowsPerPage] = React.useState(ROWS_PER_PAGE);
  const [page, setPage] = React.useState<number>(1);
  const [items, setItems] = React.useState([
    {
      translationKey: "",
      translationValue: "",
    },
  ]);

  console.log("test", items);

  const { setIsLanguageModalOpen } = React.useContext(LanguageSettingsContext);

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
    const { data: user } = await octokit.request("GET /user");
    const content = Buffer.from(JSON.stringify(items)).toString("base64");

    const result = await octokit.rest.repos.createOrUpdateFileContents({
      owner: "kyllolive",
      repo: "nextjs-octokit-demo",
      path: `translations/${languageID}.json`,
      message: "update translations",
      content,
      committer: {
        name: "epico-bot",
        email: "kyle.cuizon4@gmail.com",
      },
    });
    console.log("result", result);
  };

  const handleOpenLanguage = () => {
    setIsLanguageModalOpen(true);
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

        <Grid container>
          <Grid item xs={4}>
            <Typography gutterBottom align="center">
              {"Text Key "}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom align="center">
              {"Original Text"}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography gutterBottom align="center">
              {"Your Translation"}
            </Typography>
          </Grid>
        </Grid>
        {Object.keys(translations)
          .slice((page - 1) * rowsPerPage, page * rowsPerPage)
          .map((key, i) => (
            <Grid container spacing={2} key={i}>
              <Grid item xs={12}>
                <Item
                  translationValue={translations[key]}
                  translationKey={key}
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
          <Button onClick={handleSubmitOctokit}>Request Changes</Button>
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
