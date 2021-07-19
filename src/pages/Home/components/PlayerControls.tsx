import React, { useEffect, useState } from 'react';
import { ActiveSound, oscillate, shuffle, stop, populateUserPresets } from '../../../store/features/player';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { RootState } from '../../../store';
import { useHistory } from 'react-router-dom';
import { isEqual, values, toArray } from 'lodash';
import { uniqueNamesGenerator, adjectives, colors, names } from 'unique-names-generator';
import {
  Box,
  Grid,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import { presetsDb, auth, db } from '../../..';
import { SlowMotionVideo, Share, Shuffle, Stop, Save } from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';

const PlayerControls = ({ loadedPreset }: { loadedPreset: ActiveSound[] | null }) => {
  const dispatch = useAppDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [userPresetTitle, setUserPresetTitle] = useState('');

  const { activeSounds, isPlaying, sweeping } = useAppSelector((state: RootState) => state.player);
  const { profile, auth } = useAppSelector(state => state.firebase);
  const history = useHistory();
  const confirm = useConfirm();

  useEffect(() => {
    if (!auth.isEmpty && profile.email) {
      const getUserPresets = async () => {
        const data = (await (await db.ref(`/users/${profile.providerData[0].uid}/presets`).get()).toJSON()) as {
          [x: string]: {
            title: string;
            sounds: {
              title: string;
              volume: number;
            }[];
          };
        };
        console.log(values(data));
        const items = values(data).map(i => ({ ...i, sounds: toArray(i.sounds) }));
        dispatch(populateUserPresets({ items }));
      };
      getUserPresets();
    }
  }, [auth, openDialog, profile]);

  const createPreset = () => {
    if (isEqual(loadedPreset, activeSounds)) {
      const pathname = history.location.pathname.slice(1);
      navigator.clipboard.writeText(`${window.location.origin}/${pathname}`);
    } else {
      const title = uniqueNamesGenerator({ dictionaries: [adjectives, colors, names], length: 4 });
      presetsDb.ref(`${title}`).set({
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
          <Tooltip title={auth.isEmpty ? 'You need to login to save your own presets' : 'Save as preset'}>
            <IconButton
              size="small"
              disabled={!activeSounds.length || auth.isEmpty}
              color={sweeping ? 'secondary' : 'default'}
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              <Save />
            </IconButton>
          </Tooltip>
        </Grid>
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

      <Dialog
        maxWidth="sm"
        fullWidth
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setUserPresetTitle('');
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Save as preset</DialogTitle>
        <DialogContent>
          <DialogContentText>This will add this mix to the top panel.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Preset Title"
            type="text"
            fullWidth
            value={userPresetTitle}
            onChange={e => setUserPresetTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setUserPresetTitle('');
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenDialog(false);
              db.ref(`/users/${profile.providerData[0].uid}/presets`).push({
                title: userPresetTitle,
                sounds: activeSounds,
              });
              setUserPresetTitle('');
            }}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlayerControls;
