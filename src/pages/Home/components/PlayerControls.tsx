import React from 'react';
import { ActiveSound, oscillate, shuffle, stop } from '../../../store/features/player';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { RootState } from '../../../store';
import { useHistory } from 'react-router-dom';
import { isEqual } from 'lodash';
import { uniqueNamesGenerator, adjectives, colors, names } from 'unique-names-generator';
import { Box, Grid, Tooltip, IconButton } from '@material-ui/core';
import { db } from '../../..';
import { SlowMotionVideo, Share, Shuffle, Stop } from '@material-ui/icons';

const PlayerControls = ({ loadedPreset }: { loadedPreset: ActiveSound[] | null }) => {
  const dispatch = useAppDispatch();

  const { activeSounds, isPlaying, sweeping } = useAppSelector((state: RootState) => state.player);
  const { profile } = useAppSelector(state => state.firebase);
  const history = useHistory();

  const createPreset = () => {
    if (isEqual(loadedPreset, activeSounds)) {
      const pathname = history.location.pathname.slice(1);
      navigator.clipboard.writeText(`${window.location.origin}/${pathname}`);
    } else {
      const title = uniqueNamesGenerator({ dictionaries: [adjectives, colors, names], length: 3 });
      db.ref(`${title}`).set({
        userId: profile?.email || 'unknown',
        sounds: activeSounds,
      });

      const path = `${window.location.origin}/${title}`;

      navigator.clipboard.writeText(path);
      history.push(`/${title}`);
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item>
          <Tooltip title="Sweep - sounds will change volumes over time">
            <IconButton
              size="small"
              disabled={!activeSounds.length}
              color={sweeping ? 'secondary' : 'default'}
              onClick={() => {
                dispatch(oscillate());
              }}
            >
              <SlowMotionVideo />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Create unique name for the preset and copy link to clipboard">
            <IconButton
              size="small"
              disabled={!isPlaying || !activeSounds.length}
              onClick={() => {
                createPreset();
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Shuffle">
            <IconButton
              size="small"
              onClick={() => {
                dispatch(shuffle());
              }}
            >
              <Shuffle />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Stop/reset">
            <IconButton
              size="small"
              onClick={() => {
                dispatch(stop());
                history.push('/');
              }}
            >
              <Stop />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerControls;
