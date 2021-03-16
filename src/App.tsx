import { Box, Container, createMuiTheme, IconButton, Paper, ThemeProvider, Typography } from '@material-ui/core';
import { Person, PersonOutlined, VolumeOff, VolumeUp } from '@material-ui/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';
import Home from './pages/Home';
import useTheme from './shared/hooks/useTheme';
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

const baseTheme = createMuiTheme();
const defaultTheme = createMuiTheme({
  palette: {
    type: 'light',
    tonalOffset: 0.5,
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
});
const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    tonalOffset: 0.5,
  },
});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Performance Monitoring and get a reference to the service
const perf = firebase.performance();
const anal = firebase.analytics();

const useStyles = makeStyles((theme: Theme) => ({
  avatar: {
    borderRadius: 50,
  },
}));

function App() {
  const classes = useStyles();
  const { theme } = useTheme();
  const { isPlaying } = useSelector((state: RootState) => state.player);
  const { isLoggedIn, user, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme === 'dark' ? darkTheme : defaultTheme}>
        <Box
          minHeight="100vh"
          height="auto"
          component={Paper}
          display="flex"
          justifyContent="space-between"
          flexDirection="column"
          className="animatedBackground"
        >
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => dispatch(toggle())}>{isPlaying ? <VolumeUp /> : <VolumeOff />}</IconButton>
            <IconButton
              disabled={isLoggedIn}
              onClick={() => {
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
          <Container maxWidth="md">
            <Box pt={3}>
              <Home />
            </Box>
          </Container>
          <Box display="flex" justifyContent="center" pb={2}>
            <Typography>Version {version} |</Typography>
            <Typography>
              <a rel="noopener" target="__blank" href="mailto:mitia2022@gmail.com">
                Email author
              </a>
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
