import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playerReducer from './features/player';
import authReducer from './features/auth';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
