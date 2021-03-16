import { Box, Container, createMuiTheme, IconButton, Paper, ThemeProvider, Typography } from '@material-ui/core';
import { VolumeOff, VolumeUp } from '@material-ui/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Home from './pages/Home';
import useTheme from './shared/hooks/useTheme';
import { RootState } from './store';
import { toggle } from './store/features/player';
import { version } from '../package.json';
import firebase from 'firebase/app';
import 'firebase/auth';
import { FirebaseAuthProvider } from '@react-firebase/auth';
import { firebaseConfig } from './shared/config';

import 'firebase/performance';
import 'firebase/analytics';

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
console.log(perf);

function App() {
  const { theme } = useTheme();
  const { isPlaying } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
      <ThemeProvider theme={theme === 'dark' ? darkTheme : defaultTheme}>
        <Box minHeight="100vh" component={Paper} display="flex" justifyContent="space-between" flexDirection="column">
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={() => dispatch(toggle())}>{isPlaying ? <VolumeUp /> : <VolumeOff />}</IconButton>
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
    </FirebaseAuthProvider>
  );
}

export default App;
