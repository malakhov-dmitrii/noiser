import { Box, Divider, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { ActiveSound, playReferredPlaylist, toggle } from '../../store/features/player';
import EffectItem from './components/EffectItem';

import { useParams } from 'react-router-dom';

import { db } from '../..';
import { useAppSelector } from '../../store/hooks';
import PlayerControls from './components/PlayerControls';
import Presets from './components/Presets';

const Home = () => {
  const { preset } = useParams<{ preset: string }>();

  const dispatch = useDispatch();
  const [loadedPreset, setLoadedPreset] = useState<ActiveSound[] | null>(null);
  const { sounds } = useAppSelector((state: RootState) => state.player);

  const handlePlay = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      dispatch(toggle());
    }
  };

  const loadPreset = () => {
    db.ref(preset)
      .get()
      .then(r => {
        if (r.exists()) {
          const referredPreset = r.val()?.sounds;
          dispatch(playReferredPlaylist(referredPreset));
          setLoadedPreset(referredPreset);
        }
      });
  };

  useEffect(() => {
    if (preset) loadPreset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener('keypress', handlePlay);
    return () => {
      window.removeEventListener('keypress', handlePlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box pt={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h1">Noizer</Typography>

        <PlayerControls loadedPreset={loadedPreset} />
      </Box>
      <Divider />

      <Presets />
      <Divider></Divider>

      <Box mt={2} mb={2}>
        <Grid container spacing={3}>
          {sounds.map(i => (
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
