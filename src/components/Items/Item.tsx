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
import React, { useEffect } from "react";

export const Item = (props) => {
  const {
    translationKey,
    translationValue,
    source,
    handleNewItem,
    isCommon,
    path,
  } = props;
  const [originalText, setOriginalText] = React.useState<string>("");
  const [newText, setNewText] = React.useState<string>("");
  const [keyName, setKeyName] = React.useState<string>("");
  const [propertyPath, setPropertyPath] = React.useState<string>("");

  useEffect(() => {
    setOriginalText(translationValue);
    setKeyName(translationKey);
    setPropertyPath(path);
  }, [translationValue, translationKey, propertyPath]);

  const handleClick = () => {
    handleNewItem({
      translationKey: keyName,
      translationValue: newText,
    });
  };

  return (
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
          <Box margin={"1rem"}>
            <Typography gutterBottom align="center">
              {translationValue}
            </Typography>
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button variant="outlined" onClick={handleClick}>
          Confirm
        </Button>
      </div>
    </Box>
  );
};
