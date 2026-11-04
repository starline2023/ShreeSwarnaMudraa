import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { GLOBALS } from "../../constants/GLOBALS";
import {
  alertBoxReducer,
  clientDetailsReducers,
  groupReducer,
  orderDetailsReducer,
  otrReducer,
  snackbarReducer,
  splashReducer,
  userReducer,
} from "./reducers";
import { MMKVStorage } from "../../constants/mmkvStorage";
const keyForAppName = GLOBALS.AppName.split(" ").join("_");

const otrConfig = {
  key: `${keyForAppName}_OTR`,
  storage: MMKVStorage,
  whitelist: ["otrDisplay"],
};

const userConfig = {
  key: `${keyForAppName}_User`,
  storage: MMKVStorage,
  whitelist: ["isLoggedIn", "userDetails", "remember"],
};

const clientConfig = {
  key: `${keyForAppName}_Information`,
  storage: MMKVStorage,
  whitelist: ["Address", "BookingNumber", "Email", "Name"],
};

const rootReducer = combineReducers({
  splash: splashReducer,
  otr: persistReducer(otrConfig, otrReducer),
  user: persistReducer(userConfig, userReducer),
  clientInfo: persistReducer(clientConfig, clientDetailsReducers),
  groupData: groupReducer,
  orderDetails: orderDetailsReducer,
  snackbar: snackbarReducer,
  alertBox: alertBoxReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // getDefaultMiddleware({
  //   serializableCheck: {
  //     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //   },
  // }),
});

export const persistor = persistStore(store);
