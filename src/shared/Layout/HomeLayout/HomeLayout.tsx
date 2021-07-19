import React from 'react';
import { Box, Paper, Container } from '@material-ui/core';
import useTheme from '../../hooks/useTheme';
import Home from '../../../pages/Home/Home';
import Header from './components/Header';
import Footer from './components/Footer';

const HomeLayout = () => {
  const { theme: prefferedTheme } = useTheme();

  return (
    <Box
      minHeight="100vh"
      height="auto"
      component={Paper}
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
      className={prefferedTheme === 'gradient' ? 'animatedBackground' : ''}
    >
      <Header />

      <Container maxWidth="sm">
        <Box pt={1}>
          <Home />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default HomeLayout;
