import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import requests from "./slices/requests"

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};



const rootReducer = combineReducers({
  requests,
});

export { rootPersistConfig, rootReducer };
