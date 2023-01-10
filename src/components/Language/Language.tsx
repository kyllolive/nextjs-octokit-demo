import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import {
  Dialog,
  useTheme,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  Button,
  Divider,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/material";
import { LanguageSettingsContext } from "../../context/language.context";
import { useRouter } from "next/router";
import { LANGUAGES } from "../../constants/language.constants";

// import {
//   IUpdateLanguageSettingsData,
//   IUpdateLanguageSettingsVars,
// } from '@interfaces/user.interface';
// import { UPDATE_LANG_SETTINGS } from '@graphql/users.graphql';
// import { useAuthState } from '@contexts/auth.context';

export const Language: FC<{ preferences?: boolean }> = (props) => {
  const { preferences } = props;
  const { push, asPath, query } = useRouter();
  // const classes = useStyle();
  const { breakpoints } = useTheme();
  const languageContext = useContext(LanguageSettingsContext);
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
