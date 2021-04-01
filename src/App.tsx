import {
  Box,
  Button,
  Container,
  createMuiTheme,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { ColorLensOutlined, Email, Person, VolumeOff, VolumeUp } from '@material-ui/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';
import Home from './pages/Home';
import { RootState } from './store';
import { toggle } from './store/features/player';
import { version } from '../package.json';
import firebase from 'firebase/app';
import { firebaseConfig } from './shared/config';

import 'firebase/database';
import 'firebase/performance';
import 'firebase/analytics';
import { googleSignIn } from './store/features/auth';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { ThemeType } from './shared/hooks/useTheme';
import useTheme from './shared/hooks/useTheme';

declare const plausible: (name: string) => void;

const baseTheme = createMuiTheme();
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Performance Monitoring and get a reference to the service
firebase.performance();
firebase.analytics();

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    borderRadius: 50,
  },
}));

function App() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const { theme: prefferedTheme, toggle: changeTheme } = useTheme();
  const { isPlaying } = useSelector((state: RootState) => state.player);
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: (prefferedTheme === 'system' && prefersDarkMode) || prefferedTheme === 'dark' ? 'dark' : 'light',
        },
        typography: {
          h1: {
            fontSize: baseTheme.typography.pxToRem(42),
          },
          h2: {
            fontSize: baseTheme.typography.pxToRem(36),
          },
          h3: {
            fontSize: baseTheme.typography.pxToRem(28),
            fontWeight: 100,
          },
        },
      }),
    [prefersDarkMode, prefferedTheme]
  );

  const handleThemeClose = (type?: ThemeType) => {
    setAnchorEl(null);

    if (type) {
      plausible('change theme');

      changeTheme(type);
    }
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Box
          minHeight="100vh"
          height="auto"
          component={Paper}
          display="flex"
          justifyContent="space-between"
          flexDirection="column"
          className={prefferedTheme === 'gradient' ? 'animatedBackground' : ''}
        >
          <Box display="flex" justifyContent="flex-end">
            <Box>
              <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <ColorLensOutlined />
              </IconButton>
              <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => handleThemeClose()}>
                <MenuItem onClick={() => handleThemeClose('light')}>Light</MenuItem>
                <MenuItem onClick={() => handleThemeClose('dark')}>Dark</MenuItem>
                <MenuItem onClick={() => handleThemeClose('gradient')}>Gradient</MenuItem>
                <MenuItem onClick={() => handleThemeClose('system')}>System-based</MenuItem>
              </Menu>
            </Box>

            <IconButton
              onClick={() => {
                dispatch(toggle());
              }}
            >
              {isPlaying ? <VolumeUp /> : <VolumeOff />}
            </IconButton>

            <IconButton
              disabled={isLoggedIn}
              onClick={() => {
                plausible('Signup');
                dispatch(googleSignIn());
              }}
            >
              {isLoggedIn && user ? (
                <img alt="avatar" className={classes.avatar} src={user.photoURL || ''} width="30" height="30" />
              ) : (
                <Person />
              )}
            </IconButton>
          </Box>
          <Container maxWidth="sm">
            <Box pt={3}>
              <Home />
            </Box>
          </Container>
          <Box display="flex" justifyContent="center" alignItems="center" pb={2} flexWrap="wrap">
            <Typography variant="caption">Version {version}</Typography>
            <Box width={20}></Box>
            <Button variant="text" startIcon={<Email />} href="mailto:mitia2022@gmail.com" target="_blank" rel="noopener">
              Email author
            </Button>

            <Box px={3}>
              <a
                rel="noopener noreferrer"
                href="https://www.producthunt.com/posts/noizer?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-noizer"
                target="_blank"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=290204&theme=light"
                  alt="Noizer - Ambient sounds. Like Noisli, but free | Product Hunt"
                  style={{ width: '250px', height: '54px;' }}
                  width="250"
                  height="54"
                />
              </a>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
