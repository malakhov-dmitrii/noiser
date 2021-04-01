import { Box, Button, Divider, Grid, Tooltip, Typography } from '@material-ui/core';
import { Share, Shuffle, Stop } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ActiveSound, playPlaylistFromGroup, playReferredPlaylist, shuffle, toggle, stop } from '../../store/features/player';
import EffectItem from './components/EffectItem';
import { uniqueNamesGenerator, adjectives, colors, names } from 'unique-names-generator';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import firebase from 'firebase/app';

import 'firebase/database';
import { isEqual } from 'lodash';
declare const plausible: (name: string) => void;

const useStyles = makeStyles((theme: Theme) => ({
  playlistItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #c8c8c8',
    borderRadius: 10,
    width: 150,
    height: 50,
    transition: 'all 0.15s',
    cursor: 'pointer',
    '&:hover': {
      background: '#9c9c9c21',
    },
  },
}));

const Home = () => {
  const db = firebase.database();

  const classes = useStyles();
  const dispatch = useDispatch();
  const [loadedPreset, setLoadedPreset] = useState<ActiveSound[] | null>(null);
  const { sounds, presets, activeSounds, isPlaying } = useSelector((state: RootState) => state.player);
  const { user } = useSelector((state: RootState) => state.auth);
  const history = useHistory();

  const handlePlay = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      dispatch(toggle());
    }
  };

  const createPreset = () => {
    if (isEqual(loadedPreset, activeSounds)) {
      const pathname = history.location.pathname.slice(1);
      navigator.clipboard.writeText(`${window.location.origin}/${pathname}`);
    } else {
      const title = uniqueNamesGenerator({ dictionaries: [adjectives, colors, names], length: 3 });
      db.ref(`${title}`).set({
        userId: user?.email || 'unknown',
        sounds: activeSounds,
      });

      const path = `${window.location.origin}/${title}`;

      navigator.clipboard.writeText(path);
      history.push(`/${title}`);
    }
  };

  useEffect(() => {
    const pathname = history.location.pathname.slice(1);

    if (pathname) {
      db.ref(pathname)
        .get()
        .then(r => {
          if (r.exists()) {
            const referredPreset = r.val()?.sounds;
            dispatch(playReferredPlaylist(referredPreset));
            setLoadedPreset(referredPreset);
          }
        });
    }
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
        <Box>
          <Grid container spacing={2}>
            <Grid item>
              <Tooltip title="Create unique name for the preset and copy link to clipboard">
                <Button
                  disabled={!isPlaying || !activeSounds.length}
                  onClick={() => {
                    plausible('share');
                    createPreset();
                  }}
                  startIcon={<Share />}
                >
                  Share
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  dispatch(shuffle());
                }}
                startIcon={<Shuffle />}
              >
                Shuffle
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  dispatch(stop());
                  history.push('/');
                }}
                startIcon={<Stop />}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Divider />

      <Box my={3}>
        <Grid container spacing={2}>
          {presets.map(preset => (
            <Grid item key={preset.title}>
              <Box
                onClick={() => {
                  dispatch(playPlaylistFromGroup(preset.title));
                  // @ts-ignore
                  ym(73469224, 'reachGoal', 'start-playlist');
                }}
                className={classes.playlistItem}
              >
                <Typography variant="caption">{preset.title}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Divider></Divider>

      <Box mt={2}>
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
