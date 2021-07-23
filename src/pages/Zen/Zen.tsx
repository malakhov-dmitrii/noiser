import React, { useEffect, useState, useMemo } from 'react';
import { Button, Box, Typography, IconButton, Tooltip } from '@material-ui/core';
import { useAppSelector } from '../../store/hooks';
import { PlaylistsData } from './Mubert.model';

import ReactPlayer from 'react-player';
import PlayerAdjustments from './components/PlayerAdjustments';
import SelectionView from './components/SelectionView';
import StreamTreeView from './components/StreamTreeView';
import { getToken, getPlaylists } from './Mubert.service';
import { PlayArrow, FavoriteBorder, NotInterested, Pause } from '@material-ui/icons';
import { random } from 'lodash';
import { useFirebase } from 'react-redux-firebase';

export interface SelectionValues {
  category: number | '';
  group: number | '';
  channel: number | '';
}

const Zen = () => {
  const firebase = useFirebase();
  const { profile, auth } = useAppSelector(store => store.firebase);
  const { isPlaying, masterVolume } = useAppSelector(state => state.player);

  const [selectionValues, setSelectionValues] = useState<SelectionValues>({
    category: '',
    group: '',
    channel: '',
  });

  const [data, setData] = useState<PlaylistsData | null>(null);
  const [, setToken] = useState<string | null>(null);
  const [view] = useState<'select' | 'tree'>('select');

  const [play, setPlay] = useState(false);
  const [intensity, setIntensity] = useState<string | null>(null);
  const [bitrate, setBitrate] = useState<number | null>(null);

  useEffect(() => {
    if (profile.email) {
      getToken({ email: profile.email })
        .then(t => {
          setToken(t);
          return t;
        })
        .then(t => (t ? getPlaylists(t) : null))
        .then(r => r && setData(r?.data));
    }
  }, [profile.email]);

  const selectedCategory = data?.categories.find(i => i.category_id === selectionValues.category);
  const selectedGroup = selectedCategory?.groups.find(i => i.group_id === selectionValues.group);
  const selectedChannel = selectedGroup?.channels.find(i => i.channel_id === selectionValues.channel);
  const availableStream = selectedChannel?.stream.url || selectedGroup?.stream.url || selectedCategory?.stream.url;

  const streamParams = useMemo(() => {
    let res = '';
    if (bitrate) res += `&bitrate=${bitrate}`;
    if (intensity) res += `&intensity=${intensity}`;
    return res;
  }, [bitrate, intensity]);

  const handleSelectionChange = (type: keyof SelectionValues, value: number | '') => {
    const _selectionValues = { ...selectionValues };
    // Update changed value
    _selectionValues[type] = value;
    // Reset child values
    if (type === 'category') {
      _selectionValues.group = '';
      _selectionValues.channel = '';
    }
    if (type === 'group') _selectionValues.channel = '';

    // Update state
    setSelectionValues(_selectionValues);
  };

  const handleRandom = () => {
    const randomCategory = data!.categories[random(0, data!.categories.length - 1)];
    const randomGroup = randomCategory.groups[random(0, randomCategory.groups.length - 1)];
    const randomChannel = randomGroup.channels[random(0, randomGroup.channels.length - 1)];

    setSelectionValues({
      category: randomCategory.category_id,
      group: randomGroup.group_id,
      channel: randomChannel.channel_id,
    });
    setPlay(true);
  };

  const handleClear = () => {
    setSelectionValues({
      category: '',
      group: '',
      channel: '',
    });
    setPlay(false);
  };

  if (auth.isEmpty && !auth.isLoading)
    return (
      <Box>
        <Typography variant="h2" align="center">
          You need to login to get access to your personalized music flow
        </Typography>

        <Box mt={4} display="flex" justifyContent="center">
          <Button
            size="large"
            color="primary"
            variant="contained"
            onClick={() => {
              firebase.login({ provider: 'google', type: 'popup' });
            }}
          >
            Login with Google
          </Button>
        </Box>
      </Box>
    );

  return (
    <Box>
      {view === 'select' && (
        <SelectionView
          data={data}
          selectionValues={selectionValues}
          onChange={handleSelectionChange}
          selectedCategory={selectedCategory}
          selectedGroup={selectedGroup}
          handleClear={handleClear}
          handleRandom={handleRandom}
        />
      )}
      {view === 'tree' && <StreamTreeView data={data} />}

      <PlayerAdjustments
        data={data}
        bitrate={bitrate}
        intensity={intensity}
        onBitrateChange={setBitrate}
        onIntensityChange={setIntensity}
      />

      <Box mt={16} display="flex" justifyContent="center" alignItems="center">
        <Box mx={2}>
          <Tooltip title="Dislike">
            <span>
              <IconButton disabled={!availableStream}>
                <NotInterested></NotInterested>
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        <Button
          disabled={!availableStream}
          startIcon={play ? <Pause /> : <PlayArrow />}
          size="large"
          variant="contained"
          color="primary"
          onClick={() => setPlay(!play)}
        >
          {play ? 'Pause' : 'Play'}
        </Button>
        <Box mx={2}>
          <Tooltip title="Like">
            <span>
              <IconButton disabled={!availableStream}>
                <FavoriteBorder></FavoriteBorder>
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <ReactPlayer
        width={0}
        playing={!!play && !!availableStream}
        muted={!isPlaying}
        volume={masterVolume || 0}
        url={`${availableStream}${streamParams}`}
        config={{
          file: {
            forceAudio: true,
          },
        }}
      />
    </Box>
  );
};

export default Zen;
