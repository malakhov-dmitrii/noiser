/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Slider, Typography } from '@material-ui/core';
import React, { FC } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { setVolume, Sound, toggleSound } from '../../../store/features/player';
import { RootState } from '../../../store';
import ReactPlayer from 'react-player';

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
  title: {
    fontSize: theme.typography.pxToRem(18),
    textAlign: 'center',
  },
}));

// function fadeOut(duration = 500, setVolume: (amount: number) => void) {
//   const end = new Date().getTime() + duration;

//   const doFadeOut = () => {
//     const current = new Date().getTime();
//     const remaining = end - current;

//     if (remaining < 60) {
//       // End animation here as there's less than 60 milliseconds left
//       return;
//     }

//     // Change player volume
//     setVolume(easingFunctions.easeOutQuad(remaining / duration));

//     requestAnimationFrame(doFadeOut);
//   };

//   doFadeOut();
// }

const EffectItem: FC<Props> = ({ item }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { activeSounds, isPlaying } = useSelector((state: RootState) => state.player);

  const activeItem = activeSounds.find(i => item.title === i.title)!;

  // useEffect(() => {
  //   if (oscillation && isPlaying && activeItem) {
  //     fadeOut(50000, amount => dispatch(setVolume({ title: activeItem.title, amount })));
  //   }
  // }, [oscillation]);

  return (
    <Box
      margin="auto"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={3}
      height={150}
      // width={200}
      className={classes.item}
      onClick={e => {
        if (!item.disabled) {
          // @ts-ignore
          ym(73469224, 'reachGoal', 'pick-sound');
          dispatch(toggleSound(item.title));
        }
      }}
    >
      <Typography className={cn({ [classes.disabled]: item.disabled }, classes.title)} variant="h3">
        {item.title}
      </Typography>

      <ReactPlayer
        width={0}
        playing={!!activeItem}
        muted={!isPlaying}
        volume={activeItem?.volume}
        loop
        url={item.file}
        config={{
          file: {
            forceAudio: true,
          },
        }}
      />

      {!!activeItem && (
        <Box
          width="100%"
          height={50}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Slider
            value={activeItem.volume}
            min={0}
            step={0.01}
            max={1}
            onChange={(e, newValue) => {
              e.preventDefault();
              e.stopPropagation();
              dispatch(setVolume({ title: activeItem.title, amount: newValue as number }));
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default EffectItem;
