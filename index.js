import React from "react";
import { AppRegistry, Text, TextInput, StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import { name as appName } from "./app.json";
import App from "./App";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import notifee, { EventType } from "@notifee/react-native";
import {
  onMessage,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { messagingInstance } from "./src/notification/useNotificationService";

notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log("notifee.onBackgroundEvent :", type, detail);
  const { notification, pressAction } = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === "mark-as-read") {
    // Update external API
    await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
      method: "POST",
    });

    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});
const onDisplayNotification = async (notifi) => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  var noti = notifi.data;
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "custom-noti-sound",
    name: "Order Placed",
    vibration: true,
    sound: "OrderPlaced",
    // id: "default",
    // name: "Default Channel",
  });

  // Display a notification
  await notifee.displayNotification({
    title: noti.title,
    body: noti.body,
    data: { bit: noti.bit },
    android: {
      channelId,
      //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: "default",
      },
    },
    ios: {},
  });
};

onMessage(messagingInstance, onDisplayNotification);
setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
  console.log(
    "handled in the background when app close and kill...",
    remoteMessage,
  );
  // await notifee.displayNotification(message.data);
});
const Main = () => {
  return (
    <PaperProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <App />
      </GestureHandlerRootView>
    </PaperProvider>
  );
};

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => Main);
