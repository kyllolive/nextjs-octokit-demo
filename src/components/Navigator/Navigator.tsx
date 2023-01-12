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
import { PAGES } from "../../constants/pages.constants";

export const Navigator: FC = (props) => {
  const { push, query, pathname, asPath } = useRouter();
  const languageID = query.languageID as any;
  const [currentPath, setCurrentPath] = useState<string | undefined>(asPath);

  const handleChange = (event) => {
    setCurrentPath(event.target.value as any);
  };

  return (
    <>
      <Typography>
        <b>Choose Page to Translate</b>
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
          <Select value={currentPath} onChange={handleChange} displayEmpty>
            {/* {pages.map(({ languageID: langID, name }) => (
              <MenuItem key={langID} value={langID}>
                {name}
              </MenuItem>
            ))} */}
            {PAGES.map((item) => {
              return (
                <MenuItem
                  key={item.pathname}
                  value={item.path}
                  onClick={() => {
                    push(`${item.path}`);
                  }}
                >
                  {item.pathname}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Divider />
      </Box>
    </>
  );
};
