import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { random } from 'lodash';
import { debounce } from '@material-ui/core';
import { AppThunk } from '..';
declare const plausible: (name: string) => void;
export interface Sound {
  title: string;
  file: string;
  disabled?: boolean;
}

export interface ActiveSound {
  title: string;
  volume: number;
}

interface PresetsGroup {
  title: string;
  items: ActiveSound[][];
}

interface PlayerState {
  isPlaying: boolean;
  sweeping: boolean;
  activeSounds: ActiveSound[];
  presets: PresetsGroup[];
  sounds: Sound[];
}

const sounds = [
  { title: 'windy forest', file: '/audio/windy_forest.mp3', disabled: false },
  { title: 'cafe', file: '/audio/cafe.mp3', disabled: false },
  { title: 'airplane', file: '/audio/airplane.mp3', disabled: false },
  { title: 'rain', file: '/audio/forest_rain.mp3', disabled: false },
  { title: 'waves', file: '/audio/waves.mp3', disabled: false },
  { title: 'storm', file: '/audio/storm.mp3', disabled: false },
  { title: 'birds', file: '/audio/birds.mp3', disabled: false },
  { title: 'walk', file: '/audio/gravel_walk.mp3', disabled: false },
  { title: 'fire', file: '/audio/fire.mp3', disabled: false },
  { title: 'soft wind', file: '/audio/soft_wind.mp3', disabled: false },
  { title: 'office', file: '/audio/office.mp3', disabled: false },
];

const presets = [
  {
    title: 'Productivity',
    items: [
      [
        { title: 'rain', volume: 0.3 },
        { title: 'walk', volume: 0.6 },
        { title: 'storm', volume: 0.15 },
      ],
      [
        { title: 'waves', volume: 0.3 },
        { title: 'birds', volume: 0.15 },
        { title: 'fire', volume: 0.7 },
      ],
    ],
  },
  {
    title: 'Focus',
    items: [
      [
        { title: 'soft wind', volume: 0.4 },
        { title: 'airplane', volume: 0.6 },
        { title: 'windy forest', volume: 0.15 },
      ],
      [
        { title: 'soft wind', volume: 0.4 },
        { title: 'rain', volume: 0.6 },
        { title: 'cafe', volume: 0.3 },
      ],
    ],
  },
  {
    title: 'Relax',
    items: [
      [
        { title: 'waves', volume: 0.3 },
        { title: 'fire', volume: 0.6 },
        { title: 'windy forest', volume: 0.2 },
      ],
      [
        { title: 'birds', volume: 0.2 },
        { title: 'windy forest', volume: 0.6 },
      ],
    ],
  },
];

const initialState: PlayerState = {
  isPlaying: true,
  sweeping: false,
  activeSounds: [],
  sounds,
  presets,
};

const debounceSound = debounce(() => plausible('set volume'), 1000);

const randomSlice = <T>(arr: T[], n: number): T[] => arr.sort(() => Math.random() - Math.random()).slice(0, n);

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setOscillation: (state, action: PayloadAction<boolean>) => {
      if (state.sweeping) plausible('enable oscillation');
      else plausible('disable oscillation');
      state.sweeping = !state.sweeping;
    },
    toggle: state => {
      plausible('mute/unmute');
      state.isPlaying = !state.isPlaying;
    },
    stop: state => {
      plausible('stop');
      state.activeSounds = [];
      // state.isPlaying = false;
    },
    toggleSound: (state, action: PayloadAction<string>) => {
      plausible('toggle sound');

      const exist = state.activeSounds.find(i => i.title === action.payload);
      if (exist) state.activeSounds = state.activeSounds.filter(i => i.title !== action.payload);
      else state.activeSounds = [...state.activeSounds, { title: action.payload, volume: 0.5 }];
    },
    playReferredPlaylist: (state, action: PayloadAction<ActiveSound[]>) => {
      plausible('play shared playlist');
      state.activeSounds = action.payload;
    },
    playPlaylistFromGroup: (state, action: PayloadAction<string>) => {
      plausible('play defined playlist');
      const sets = [...state.presets.find(i => i.title === action.payload)!.items];
      const ready = sets[random(0, sets.length - 1)];
      state.activeSounds = ready;
    },
    setVolume: (state, action: PayloadAction<{ title: string; amount: number }>) => {
      debounceSound();
      const item = state.activeSounds.find(i => i.title === action.payload.title)!;
      if (item) {
        item.volume = action.payload.amount;
      }
    },
    shuffle: state => {
      plausible('shuffle');

      state.activeSounds = randomSlice(
        state.sounds.filter(i => !i.disabled).map(i => i.title),
        random(2, 4)
      ).map(i => ({ title: i, volume: random(0.2, 0.9) }));
    },
  },
});

const wait = (delay: number) => {
  return new Promise(r => setTimeout(r, delay));
};

const adjustVolume = async (
  originalVolume: number,
  newVolume: number,
  setVolume: (amount: number) => void,
  {
    duration = 5000,
    easing = swing,
    interval = 17,
  }: {
    duration?: number;
    easing?: typeof swing;
    interval?: number;
  } = {}
): Promise<void> => {
  const delta = newVolume - originalVolume;

  if (!delta || !duration || !easing || !interval) {
    setVolume(newVolume);
    return Promise.resolve();
  }

  const ticks = Math.floor(duration / interval);
  let tick = 1;

  return new Promise(resolve => {
    const timer = setInterval(() => {
      setVolume(originalVolume + easing(tick / ticks) * delta);

      if (++tick === ticks + 1) {
        clearInterval(timer);
        // console.log('resolved 1');
        resolve();
      }
    }, interval);
  });
};

export function swing(p: number) {
  return 0.5 - Math.cos(p * Math.PI) / 2;
}

export const {
  toggle,
  toggleSound,
  setOscillation,
  playPlaylistFromGroup,
  shuffle,
  setVolume,
  playReferredPlaylist,
  stop,
} = playerSlice.actions;

export const oscillate = (): AppThunk => async (dispatch, getState) => {
  const go = (
    getState: () => {
      player: PlayerState;
      auth: any;
    }
  ) =>
    new Promise((res, rej) => {
      // console.log(getState().player);
      const { activeSounds } = getState().player;

      Promise.all(
        activeSounds.map(sound => {
          // console.log(`sound ${sound.title}: ${sound.volume} started sweep`);

          const updateVolume = (amount: number) => dispatch(setVolume({ title: sound.title, amount }));
          return adjustVolume(sound.volume, random(0.1, 1), updateVolume);
        })
      )
        .then(() => console.log('all sounds adjusted'))
        .then(() => wait(1000))

        .then(() => {
          console.log(getState().player.sweeping);
          if (getState().player.sweeping) {
            go(getState);
          }
        });
    });

  if (!getState().player.sweeping) {
    dispatch(setOscillation(true));
    plausible('enable sweep');
    go(getState);
  } else {
    plausible('disable sweep');
    dispatch(setOscillation(false));
  }
};

export default playerSlice.reducer;
