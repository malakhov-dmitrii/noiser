import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { random, sortBy } from 'lodash';
import { debounce } from '@material-ui/core';
import { AppThunk } from '..';
import { analytics } from '../..';
export interface Sound {
  title: string;
  emoji?: string;
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
  cached: boolean;
  masterVolume: number;
}

const sounds = sortBy(
  [
    { emoji: '🌳', title: 'windy forest', file: '/audio/windy_forest.mp3', disabled: false },
    { emoji: '☕️', title: 'cafe', file: '/audio/cafe.mp3', disabled: false },
    { emoji: '🌬', title: 'fan', file: '/audio/fan.mp3', disabled: false },
    { emoji: '🏡', title: 'garden', file: '/audio/garden.mp3', disabled: false },
    { emoji: '👽', title: 'omnious', file: '/audio/omnious.mp3', disabled: false },
    { emoji: '🐈', title: 'purr', file: '/audio/purr.mp3', disabled: false },
    { emoji: '🌃', title: 'summer night', file: '/audio/summer-night.mp3', disabled: false },
    { emoji: '🎧', title: 'white noise', file: '/audio/white noise.mp3', disabled: false },
    { emoji: '🛤', title: 'railway', file: '/audio/railway.mp3', disabled: false },
    { emoji: '🌆', title: 'city', file: '/audio/city.mp3', disabled: false },
    { emoji: '🛰', title: 'space', file: '/audio/space.mp3', disabled: false },
    { emoji: '✈️', title: 'airplane', file: '/audio/airplane.mp3', disabled: false },
    { emoji: '⛈', title: 'rain', file: '/audio/forest_rain.mp3', disabled: false },
    { emoji: '🌊', title: 'waves', file: '/audio/waves.mp3', disabled: false },
    { emoji: '🌪', title: 'storm', file: '/audio/storm.mp3', disabled: false },
    { emoji: '🕊', title: 'birds', file: '/audio/birds.mp3', disabled: false },
    { emoji: '🚶‍♂️', title: 'walk', file: '/audio/gravel_walk.mp3', disabled: false },
    { emoji: '🔥', title: 'fire', file: '/audio/fire.mp3', disabled: false },
    { emoji: '🍃', title: 'soft wind', file: '/audio/soft_wind.mp3', disabled: false },
    { emoji: '🏢', title: 'office', file: '/audio/office.mp3', disabled: false },
  ],
  'title'
);

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
  masterVolume: 1,
  cached: false,
  isPlaying: true,
  sweeping: false,
  activeSounds: [],
  sounds,
  presets,
};

const debounceSound = debounce(() => analytics.logEvent('set volume'), 1000);

const randomSlice = <T>(arr: T[], n: number): T[] => arr.sort(() => Math.random() - Math.random()).slice(0, n);

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    cache: state => {
      state.cached = true;
    },
    setOscillation: (state, action: PayloadAction<boolean>) => {
      state.sweeping = !state.sweeping;
    },
    toggle: state => {
      analytics.logEvent('mute/unmute');
      state.isPlaying = !state.isPlaying;
    },
    stop: state => {
      analytics.logEvent('stop');
      state.activeSounds = [];
      // state.isPlaying = false;
    },
    toggleSound: (state, action: PayloadAction<string>) => {
      analytics.logEvent('toggle sound');

      const exist = state.activeSounds.find(i => i.title === action.payload);
      if (exist) state.activeSounds = state.activeSounds.filter(i => i.title !== action.payload);
      else state.activeSounds = [...state.activeSounds, { title: action.payload, volume: 0.5 }];
    },
    playReferredPlaylist: (state, action: PayloadAction<ActiveSound[]>) => {
      analytics.logEvent('play shared playlist');
      state.activeSounds = action.payload;
    },
    playPlaylistFromGroup: (state, action: PayloadAction<string>) => {
      analytics.logEvent('play defined playlist');
      const sets = [...state.presets.find(i => i.title === action.payload)!.items];
      const ready = sets[random(0, sets.length - 1)];
      state.activeSounds = ready;
    },
    setMasterVolume: (state, action: PayloadAction<number>) => {
      state.masterVolume = action.payload;
    },
    setVolume: (state, action: PayloadAction<{ title: string; amount: number }>) => {
      debounceSound();
      const item = state.activeSounds.find(i => i.title === action.payload.title)!;
      if (item) {
        item.volume = action.payload.amount;
      }
    },
    shuffle: state => {
      analytics.logEvent('shuffle');

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
  setMasterVolume,
  toggleSound,
  setOscillation,
  playPlaylistFromGroup,
  shuffle,
  setVolume,
  playReferredPlaylist,
  stop,
  cache,
} = playerSlice.actions;

export const oscillate = (): AppThunk => async (dispatch, getState) => {
  const go = (
    getState: () => {
      player: PlayerState;
    }
  ) =>
    new Promise((res, rej) => {
      const { activeSounds } = getState().player;

      Promise.all(
        activeSounds.map(sound => {
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
    analytics.logEvent('enable sweep');
    go(getState);
  } else {
    analytics.logEvent('disable sweep');
    dispatch(setOscillation(false));
  }
};

export default playerSlice.reducer;
