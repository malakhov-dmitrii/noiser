/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Slider, Typography } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { Howl } from 'howler';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { setVolume, Sound, toggleSound } from '../../../../store/features/player';
import { RootState } from '../../../../store';

interface Props {
  item: Sound;
}

const useStyles = makeStyles((theme: Theme) => ({
  disabled: {
    color: theme.palette.secondary.light,
  },
  item: {
    cursor: 'pointer',
    // border: '1px solid #929292',
    borderRadius: 15,
    boxShadow: '-8px 9px 20px 0px #7979794f',
  },
}));

const EffectItem: FC<Props> = ({ item }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { activeSounds, isPlaying } = useSelector((state: RootState) => state.player);

  const activeItem = activeSounds.find(i => item.title === i.title)!;
  const playing = !!activeItem && isPlaying;

  const [sound] = useState<Howl>(
    new Howl({
      src: [item.file],
      volume: activeItem?.volume || 0.5,
      loop: true,
    })
  );

  useEffect(() => {
    return () => sound.unload();
  }, []);

  useEffect(() => {
    if (playing) sound.play();
    if (!playing) sound.stop();
  }, [playing]);

  return (
    <Box
      margin="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={3}
      height={200}
      // width={200}
      className={classes.item}
      onClick={e => {
        if (!item.disabled) {
          dispatch(toggleSound(item.title));
        }
      }}
    >
      <Typography className={cn({ [classes.disabled]: item.disabled })} variant="h3">
        {item.title}
      </Typography>

      <Box
        width="100%"
        height={50}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {playing && (
          <Slider
            value={activeItem.volume}
            min={0}
            step={0.01}
            max={1}
            onChange={(e, newValue) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(setVolume({ title: activeItem.title, amount: newValue as number }));
              sound.volume(newValue as number);
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default EffectItem;
