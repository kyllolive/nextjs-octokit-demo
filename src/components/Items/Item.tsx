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
import React from "react";

export const Item = (props) => {
  const { translationKey, translationValue, handleNewItem } = props;
  const [originalText, setOriginalText] = React.useState<string>("");
  const [newText, setNewText] = React.useState<string>("");
  const [keyName, setKeyName] = React.useState<string>(translationKey);

  const handleChange = (event) => {};

  const handleClick = () => {
    handleNewItem({
      translationKey: keyName,
      translationValue: newText,
    });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Box margin={"1rem"}>
            <Typography
              gutterBottom
              align="center"
              style={{
                fontSize: "13px",
              }}
            >
              {translationKey}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box margin={"1rem"}>
            <Typography gutterBottom align="center">
              {translationValue}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box style={{ margin: "1rem" }}>
            <TextField
              type="text"
              onChange={(event) => {
                setNewText(event.target.value);
              }}
            />
          </Box>
        </Grid>
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
