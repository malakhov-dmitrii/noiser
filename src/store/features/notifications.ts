import { Color } from '@material-ui/lab';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AppThunk, RootState } from '../index';

interface Notification {
  type: Color;
  message: string;
  preventAutoDismiss?: boolean;
}

export interface NotificationItem extends Notification {
  id: number;
}

interface NotificationsState {
  items: NotificationItem[];
}

const defaultDelay = 3000;

const initialState: NotificationsState = {
  items: [],
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fireEvent: (state, action: PayloadAction<NotificationItem>) => {
      state.items = [...state.items, action.payload];
    },
    dismiss: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    pop: state => {
      const newState = state.items.slice();
      newState.shift();
      state.items = newState;
    },
  },
});

export const { fireEvent, dismiss, pop } = notificationsSlice.actions;

export const emit = (message: string, color: Color, preventAutoDismiss = false): AppThunk => (dispatch, getState) => {
  const state = getState();
  const lastItem = state.notifications.items[state.notifications.items.length - 1];
  const lastId = lastItem?.id + 1 || 1;
  dispatch(fireEvent({ message, type: color, id: lastId }));
  if (!preventAutoDismiss) {
    setTimeout(() => {
      dispatch(dismiss(lastId));
    }, defaultDelay);
  }
};

export const selectNotifications = (state: RootState): NotificationItem[] => state.notifications.items;

export default notificationsSlice.reducer;
