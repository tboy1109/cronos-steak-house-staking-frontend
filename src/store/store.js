import { applyMiddleware, compose, createStore, combineReducers } from 'redux';

import thunk from 'redux-thunk';
import * as Sentry from '@sentry/react';
import createSentryMiddleware from 'redux-sentry-middleware';

import { appInitializeStateReducer } from '../GlobalState/InitSlice';
import { user } from '../GlobalState/User';

const rootReducer = combineReducers({
  user: user,
  appInitialize: appInitializeStateReducer,
});

const reduxDevToolsComposeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sentryEnhancedMiddlewares = applyMiddleware(thunk, createSentryMiddleware(Sentry, {}));

const enableDevTools = process.env.NODE_ENV !== 'production' || process.env.REACT_APP_DEVTOOLS === 'true';

const reduxDevToolsEnhancedMiddlewares = enableDevTools
  ? reduxDevToolsComposeEnhancers(sentryEnhancedMiddlewares)
  : sentryEnhancedMiddlewares;

const store = createStore(rootReducer, reduxDevToolsEnhancedMiddlewares);

export default store;
