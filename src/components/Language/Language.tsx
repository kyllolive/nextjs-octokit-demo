import React, { FC, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Button,
  Divider,
  Box,
  Typography,
} from "@mui/material";

import { useRouter } from "next/router";
import { LANGUAGES } from "../../constants/language.constants";

export const Language: FC = (props) => {
  const { push, asPath, query } = useRouter();
  const languageID = query.languageID as any;
  const [language, setLanguage] = useState<string | undefined>(languageID);

  const handleChangeLanguage = (event) => {
    setLanguage(event.target.value as any);
  };

  const handleProceed = () => {
    let urlArr: string[] = asPath.split("/");
    if (urlArr[1] && typeof language === "string") {
      urlArr[1] = language;
      push(urlArr.join("/"), "", { shallow: false });
    }
  };

  return (
    <>
      <Typography>
        <b>Choose Language to Translate</b>
      </Typography>

      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          margin: "2rem",
        }}
      >
        <FormControl variant="outlined">
          <Select value={language} onChange={handleChangeLanguage}>
            {LANGUAGES.map(({ languageID: langID, name }) => (
              <MenuItem key={langID} value={langID}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider />
        <Button onClick={handleProceed}>ok</Button>
      </Box>
    </>
  );
};
