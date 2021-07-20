import React from 'react';
import { ThemeType } from '../../../hooks/useTheme';
import { IconButton, Menu, MenuItem, Box } from '@material-ui/core';
import { ColorLensOutlined } from '@material-ui/icons';

const ThemePicker = ({ changeTheme }: { changeTheme: (theme: ThemeType) => void }) => {
  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleThemeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setThemeMenuAnchorEl(event.currentTarget);
  };
  const handleThemeClose = (type?: ThemeType) => {
    setThemeMenuAnchorEl(null);

    if (type) {
      changeTheme(type);
    }
  };

  return (
    <Box>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleThemeClick}>
        <ColorLensOutlined />
      </IconButton>
      <Menu id="simple-menu" anchorEl={themeMenuAnchorEl} keepMounted open={Boolean(themeMenuAnchorEl)} onClose={() => handleThemeClose()}>
        <MenuItem onClick={() => handleThemeClose('light')}>Light</MenuItem>
        <MenuItem onClick={() => handleThemeClose('dark')}>Dark</MenuItem>
        <MenuItem onClick={() => handleThemeClose('gradient')}>Gradient</MenuItem>
        <MenuItem onClick={() => handleThemeClose('system')}>System-based</MenuItem>
      </Menu>
    </Box>
  );
};

export default ThemePicker;
