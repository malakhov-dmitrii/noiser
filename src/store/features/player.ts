import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { random } from 'lodash';
import { debounce } from '@material-ui/core';
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
  oscillation: boolean;
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
];

const initialState: PlayerState = {
  isPlaying: true,
  oscillation: false,
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
    toggleOscillation: state => {
      if (state.oscillation) plausible('enable oscillation');
      else plausible('disable oscillation');
      state.oscillation = !state.oscillation;
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
      item.volume = action.payload.amount;
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

export const {
  toggle,
  toggleSound,
  toggleOscillation,
  playPlaylistFromGroup,
  shuffle,
  setVolume,
  playReferredPlaylist,
  stop,
} = playerSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = (amount: number): AppThunk => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;

export default playerSlice.reducer;
