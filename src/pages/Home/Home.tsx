import { Box, Divider, Grid, Typography, withStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ActiveSound, playReferredPlaylist } from '../../store/features/player';
import EffectItem from './components/EffectItem';

import { useParams } from 'react-router-dom';

import { presetsDb, storage } from '../..';
import { useAppSelector } from '../../store/hooks';
import PlayerControls from './components/PlayerControls';
import Presets from './components/Presets';
import { ExpandMore } from '@material-ui/icons';

import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

const Accordion = withStyles({
  root: {
    border: 'none',
    boxShadow: 'none',
    background: 'transparent',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'transparent',
    borderBottom: 'none',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2, 3),
  },
}))(MuiAccordionDetails);

const Home = () => {
  const { preset } = useParams<{ preset: string }>();

  const dispatch = useDispatch();
  const [loadedPreset, setLoadedPreset] = useState<ActiveSound[] | null>(null);
  const { sounds } = useAppSelector(state => state.player);
  const { auth } = useAppSelector(state => state.firebase);

  const loadPreset = () => {
    presetsDb
      .ref(`${preset}`)
      .get()
      .then(r => {
        if (r.exists()) {
          const referredPreset = r.val()?.sounds;
          dispatch(playReferredPlaylist(referredPreset));
          setLoadedPreset(referredPreset);
        }
      });
  };

  // TODO: List files library
  useEffect(() => {
    if (!auth.isEmpty) {
      const getFiles = async () => {
        const a = storage.ref();
        const items = (await a.listAll()).items;
        const results = [];
        for await (const item of items) {
          const url = await item.getDownloadURL();
          results.push(url);
        }
      };
      getFiles();
    }
  }, [auth]);

  useEffect(() => {
    if (preset) loadPreset();
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

      <Accordion disabled={auth.isEmpty || true}>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
          <Box display="flex" alignItems="center">
            <Typography variant="h3">Your library</Typography>
            <Box ml={3}>
              <Typography variant="body2">Coming soon!</Typography>
            </Box>
            {/* {auth.isEmpty && (
              <Box ml={3}>
                <Typography variant="body2">You need to login to see your library</Typography>
              </Box>
            )} */}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {sounds.map(i => (
              <Grid item xs={6} md={3} key={i.title}>
                <EffectItem item={i} />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Box mt={2}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel2a-content" id="panel2a-header">
            <Typography variant="h3">Noizer library</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {sounds.map(i => (
                <Grid item xs={6} md={3} key={i.title}>
                  <EffectItem item={i} />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default Home;
