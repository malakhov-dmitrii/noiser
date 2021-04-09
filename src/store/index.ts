import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playerReducer from './features/player';
import notificationsReducer from './features/notifications';
import authReducer from './features/auth';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    auth: authReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
