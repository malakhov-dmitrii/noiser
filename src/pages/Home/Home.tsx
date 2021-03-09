import { Box, Button, Divider, Grid, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { shuffle, toggle } from '../../store/features/player';
import EffectItem from './components/EffectItem';

const effects = [
  { title: 'rain', file: '/audio/forest_rain.mp3', disabled: false },
  { title: 'waves', file: '/audio/waves.mp3', disabled: false },
  { title: 'storm', file: '/audio/storm.mp3', disabled: false },
  { title: 'birds', file: '/audio/birds.mp3', disabled: false },
  { title: 'walk', file: '/audio/gravel_walk.mp3', disabled: false },
  { title: 'office', file: '/audio/office.mp3', disabled: false },
  { title: 'fire', file: '/audio/fire.mp3', disabled: false },
  { title: 'soft wind', file: '/audio/soft_wind.mp3', disabled: false },
  { title: 'cafe', file: '', disabled: true },
  { title: 'drops', file: '', disabled: true },
];

const Home = () => {
  const dispatch = useDispatch();

  const handlePlay = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      dispatch(toggle());
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', handlePlay);
    return () => {
      window.removeEventListener('keypress', handlePlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Box>
        <Typography variant="h1">Home</Typography>
        <Button
          onClick={() => {
            dispatch(shuffle());
          }}
        >
          Shuffle
        </Button>
      </Box>
      <Divider />
      <Box mt={2}>
        <Grid container spacing={3}>
          {effects.map(i => (
            <Grid item xs={6} md={3} key={i.title}>
              <EffectItem item={i} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
