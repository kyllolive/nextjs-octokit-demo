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

export const HomeTest = (props) => {
  const ROWS_PER_PAGE = 10;
  const { translations, sourceLanguage, namespace, uniqueProperties } = props;
  const properties = uniqueProperties.unique;
  const { query } = useRouter();
  const languageID = query.languageID as string;
  const [rowsPerPage] = React.useState(ROWS_PER_PAGE);
  const [page, setPage] = React.useState<number>(1);
  const [searchField, setSearchField] = React.useState("");
  const [items, setItems] = React.useState([
    {
      translationKey: "test",
      translationValue: "test",
      path: "test",
    },
  ]);

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
    console.log("items", items);
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
          {/* <Grid item xs={4}>
            <Typography gutterBottom align="center">
              {"Your Translation"}
            </Typography>
          </Grid> */}
        </Grid>
        {properties
          .slice((page - 1) * rowsPerPage, page * rowsPerPage)
          .map((key, i) => (
            <Grid container spacing={2} key={i}>
              <Grid item xs={12}>
                <ItemTest property={key} handleNewItem={handleNewItem} />
              </Grid>
            </Grid>
          ))}
        {/* {searchField === "" 
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
        {/* {searchField !== "" &&
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
          ))} */}
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
