import { Box, Container, createMuiTheme, IconButton, Paper, ThemeProvider } from '@material-ui/core';
import { VolumeOff, VolumeUp } from '@material-ui/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Home from './pages/Home';
import useTheme from './shared/hooks/useTheme';
import { RootState } from './store';
import { toggle } from './store/features/player';

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

function App() {
  const { theme } = useTheme();
  const { isPlaying } = useSelector((state: RootState) => state.player);
  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : defaultTheme}>
      <Box minHeight="100vh" component={Paper}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton onClick={() => dispatch(toggle())}>{isPlaying ? <VolumeUp /> : <VolumeOff />}</IconButton>
        </Box>
        <Container maxWidth="md">
          <Box pt={5}>
            <Home />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
