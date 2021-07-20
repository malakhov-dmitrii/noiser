import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store, rrfProps } from './store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { CssBaseline } from '@material-ui/core';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { FirebaseAuthProvider } from '@react-firebase/auth';

import firebase from 'firebase';
import { firebaseConfig, sharedPresetsFirebaseConfig } from './shared/config';

import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/database';
import 'firebase/performance';
import 'firebase/app-check';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const primaryApp = firebase.initializeApp(firebaseConfig);
const presetsApp = firebase.initializeApp(sharedPresetsFirebaseConfig, 'presets_app');

// const appCheck = firebase.appCheck();
// appCheck.activate('6LfVBqcbAAAAAHwqzRy6EjkCijf_DKFQ9D0cNJG0');

export const auth = firebase.auth();
export const presetsDb = firebase.database(presetsApp);
export const db = firebase.database();
export const analytics = firebase.analytics();
export const storage = firebase.storage();

if (process.env.NODE_ENV === 'development') {
  // auth.useEmulator('http://localhost:9099');
  // db.useEmulator('localhost', 9000);
}

ReactDOM.render(
  <React.StrictMode>
    <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <CssBaseline />
          <App />
        </ReactReduxFirebaseProvider>
      </Provider>
    </FirebaseAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
