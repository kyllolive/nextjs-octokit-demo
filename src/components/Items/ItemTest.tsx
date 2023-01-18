import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  TextField,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import EdiText from "react-editext";
import React, { useEffect, useState } from "react";
import { Item } from "./Item";

const useStyles = makeStyles(() => ({
  textArea: {
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
  },
}));

export const ItemTest = (props) => {
  const classes = useStyles();

  const { property, handleNewItem } = props;
  const propertyKeys = Object.keys(property);
  const translationKey = propertyKeys[0];
  const translationValue = property[translationKey];
  const sourceValue = property[propertyKeys[1]];
  const isCommon = property[propertyKeys[2]];
  const path = property[propertyKeys[3]];

  const [newText, setNewText] = React.useState<string>("");
  const [keyName, setKeyName] = React.useState<string>("");
  const [propertyPath, setPropertyPath] = React.useState<string>("");

  useEffect(() => {
    setKeyName(translationKey);
    setPropertyPath(path);
  }, [translationValue, translationKey, propertyPath]);

  const handleSave = (event) => {
    if (event === newText) return;
    setNewText(event);
    handleNewItem({
      translationKey: keyName,
      translationValue: newText,
      path: propertyPath,
    });
  };
  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box margin={"1rem"}>
              <Typography gutterBottom align="center">
                {sourceValue}
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

              <EdiText
                className={classes.textArea}
                value={translationValue}
                type="text"
                onSave={(event) => {
                  handleSave(event);
                }}
              />
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
