import { useEffect, useCallback, useRef } from "react";
import {
  getMessaging,
  getToken,
  onNotificationOpenedApp,
  getInitialNotification,
  subscribeToTopic,
  isDeviceRegisteredForRemoteMessages,
  registerDeviceForRemoteMessages,
} from "@react-native-firebase/messaging";
import { getApp } from "@react-native-firebase/app";
import {
  checkNotifications,
  requestNotifications,
  openSettings,
  RESULTS,
} from "react-native-permissions";
import notifee, { EventType } from "@notifee/react-native";
import { useDispatch, useSelector } from "react-redux";

import { navigate } from "../navigations/RootNavigation";
import { AlertClose, AlertOpen, fcmTokenAction } from "../redux/action";
import { GLOBALS } from "../../constants/GLOBALS";
import { IS_ANDROID } from "../../constants/Styles";

import { PermissionsAndroid, Platform } from "react-native";

export const firebaseApp = getApp();
export const messagingInstance = getMessaging(firebaseApp);

export const useNotificationService = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const requestNotificationPermission = useCallback(async () => {
    try {
      if (Platform.OS === "android") {
        if (Platform.Version < 33) {
          return true;
        }

        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        }

        if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          dispatch(
            AlertOpen({
              title: "",
              description:
                "Notification permission is required. Please enable it from Settings.",
              yesText: "Settings",
              noText: "Cancel",
              onYesPress: async () => {
                dispatch(AlertClose());
                await openSettings();
              },
              onNoPress: () => dispatch(AlertClose()),
            }),
          );
        }

        return false;
      }

      // ============================
      // iOS
      // ============================

      let { status } = await checkNotifications();

      if (status === RESULTS.DENIED) {
        ({ status } = await requestNotifications(["alert", "badge", "sound"]));
      }

      if (status === RESULTS.BLOCKED) {
        dispatch(
          AlertOpen({
            title: "Notification",
            description:
              "Notification permission is required. Please enable it from Settings.",
            yesText: "Settings",
            noText: "Cancel",
            onYesPress: async () => {
              dispatch(AlertClose());
              await openSettings();
            },
            onNoPress: () => dispatch(AlertClose()),
          }),
        );
      }

      return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
    } catch (error) {
      console.log("Notification Permission Error", error);
      return false;
    }
  }, [dispatch]);

  const onNotificationPress = useCallback(
    (bit) => {
      if (!bit) return;
      setTimeout(() => {
        if (GLOBALS.forceLogin && !user?.isLoggedIn) {
          navigate("Login");
          return;
        }
        if (bit === "1") {
          navigate("News");
        }
      }, 3000);
    },
    [user?.isLoggedIn],
  );

  const fetchDeviceToken = useCallback(async () => {
    try {
      if (user?.fcmToken) {
        return;
      }

      if (
        !IS_ANDROID &&
        !isDeviceRegisteredForRemoteMessages(messagingInstance)
      ) {
        await registerDeviceForRemoteMessages(messagingInstance);
      }

      const token = await getToken(messagingInstance);

      if (token) {
        dispatch(fcmTokenAction(token));
      }
    } catch (error) {
      console.log("FCM Token Error", error);
    }
  }, [dispatch, user?.fcmToken]);

  const checkApplicationPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();

    if (!granted) {
      return;
    }

    await fetchDeviceToken();

    await subscribeToTopic(messagingInstance, GLOBALS.FirmName);
  }, [fetchDeviceToken, requestNotificationPermission]);

  const onNotificationPressRef = useRef(onNotificationPress);

  useEffect(() => {
    onNotificationPressRef.current = onNotificationPress;
  }, [onNotificationPress]);

  useEffect(() => {
    checkApplicationPermission();
    subscribeToTopic(messagingInstance, GLOBALS.FirmName);

    const unsubscribeForeground = notifee.onForegroundEvent(
      ({ type, detail }) => {
        const { notification } = detail || {};
        const bit = notification?.data?.bit;
        if (type === EventType.PRESS) onNotificationPressRef.current(bit);
        if (type === EventType.DELIVERED && bit === "1") {
          const alertObj = {
            description: notification?.body,
            title: notification?.title,
            yesText: "OK",
            noText: "",
            onYesPress: () => dispatch(AlertClose()),
            onNoPress: () => {},
          };
          dispatch(AlertOpen(alertObj));
        }
      },
    );

    const unsubscribeBackground = notifee.onBackgroundEvent(
      async ({ type, detail }) => {
        const { notification, pressAction } = detail;
        if (
          type === EventType.ACTION_PRESS &&
          pressAction.id === "mark-as-read"
        ) {
          await notifee.cancelNotification(notification.id);
        }
      },
    );

    const unsubscribeOpenedApp = onNotificationOpenedApp(
      messagingInstance,
      (remoteMessage) => {
        onNotificationPressRef.current(remoteMessage?.data?.bit);
      },
    );

    getInitialNotification(messagingInstance).then((remoteMessage) => {
      onNotificationPressRef.current(remoteMessage?.data?.bit);
    });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground?.();
      unsubscribeOpenedApp?.();
    };
  }, [dispatch, checkApplicationPermission]);
};
