import { configureStore, ThunkAction, Action, Reducer, AnyAction } from '@reduxjs/toolkit';
import playerReducer from './features/player';
import notificationsReducer from './features/notifications';
import firebase from 'firebase/app';

// eslint-disable-next-line import/no-duplicates
import 'firebase/database';
// eslint-disable-next-line import/no-duplicates
import 'firebase/auth';
import { constants as rfConstants } from 'redux-firestore';

import { firebaseReducer, getFirebase, actionTypes as rrfActionTypes } from 'react-redux-firebase';
const rrfConfig = {
  userProfile: 'users',
};

const typedFirebaseReducer: Reducer<any, AnyAction> = firebaseReducer;

export const store = configureStore({
  reducer: {
    firebase: typedFirebaseReducer,
    player: playerReducer,
    notifications: notificationsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // just ignore every redux-firebase and react-redux-firebase action type
          ...Object.keys(rfConstants.actionTypes).map(type => `${rfConstants.actionsPrefix}/${type}`),
          ...Object.keys(rrfActionTypes).map(type => `@@reactReduxFirebase/${type}`),
        ],
        ignoredPaths: ['firebase', 'firestore'],
      },
      thunk: {
        extraArgument: {
          getFirebase,
        },
      },
    }),
});

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
