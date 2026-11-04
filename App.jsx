import React, { createContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/store";
import { GLOBALS } from "./constants/GLOBALS";
import * as SignalR from "@microsoft/signalr";
import { URL } from "react-native-url-polyfill";
import { NavigationContainer } from "@react-navigation/native";

import "react-native-gesture-handler";
import { useNetInfo } from "@react-native-community/netinfo";

import { LogBox } from "react-native";
import NavigationHandler from "./src/navigations/NavigationHandler";
import { navigationRef } from "./src/navigations/RootNavigation";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();

const adminSignalRsocket = new SignalR.HubConnectionBuilder()
  .withUrl(new URL(GLOBALS.adminSignalR_URL).toString(), {
    transport: SignalR.HttpTransportType.WebSockets,
    skipNegotiation: true,
  })
  .withAutomaticReconnect()
  .build();

export const SignalRContext = createContext();
const App = () => {
  const { isInternetReachable } = useNetInfo();
  const [appState, setAppState] = useState(AppState.currentState);
  const [signalRSocket, setSignalRSocket] = useState(null);

  const handleAppStateChange = (nextAppState) => {
    setAppState(nextAppState);
  };
  useEffect(() => {
    const app = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      app.remove();
    };
  }, []);
  useEffect(() => {
    if (appState == "active" && isInternetReachable) {
      handleSignalRConnection();
      adminSignalRsocket.onreconnecting(() => setSignalRSocket(null));
      adminSignalRsocket.onreconnected(() =>
        setSignalRSocket(adminSignalRsocket)
      );
    }
  }, [appState, isInternetReachable]);

  const handleSignalRConnection = async () => {
    try {
      if (
        isInternetReachable &&
        adminSignalRsocket.state === SignalR.HubConnectionState.Disconnected
      ) {
        adminSignalRsocket
          .start()
          .then(() => setSignalRSocket(adminSignalRsocket));
      }
    } catch (error) {
      console.log("handleSignalRConnection error :", error);
    }
  };

  return (
    <SignalRContext.Provider value={signalRSocket}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer ref={navigationRef}>
            <NavigationHandler />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </SignalRContext.Provider>
  );
};

export default App;
