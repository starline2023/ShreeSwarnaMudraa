import { useNetInfo } from "@react-native-community/netinfo";
import React, { useContext, useEffect, useState } from "react";
import {
  AppState,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../constants/Colors";

import { IS_ANDROID } from "../../constants/Styles";

import {
  AlertClose,
  AlertOpen,
  ClientDetailsAction,
  logoutAction,
  OrderDetailsUpdate,
  SymbolCoomonGroupDataAction,
  SymbolGroupDataAction,
} from "../redux/action";

import { versionAPI } from "../../constants/APIs";

import DeviceInfo from "react-native-device-info";
import Splash from "../screens/stack/Splash/Splash";

import { GLOBALS } from "../../constants/GLOBALS";
import AlertBox from "../components/customModals/AlertBox";
import NoInternet from "../components/noInternet/NoInternet";

import {
  inflateData,
  OpenSnackbar,
  valuesWithSpecificKeys,
} from "../../constants/Functions";
import Adbanner from "../components/customModals/Adbanner";

import { navigate } from "./RootNavigation";

import AnimatedTab from "../components/bottomTab/AnimatedTab";
import ContactDetails from "../screens/stack/menu/ContactDetails";
import Calculator from "../screens/stack/menu/Calculator";

import News from "../screens/stack/News/News";
import { SignalRContext } from "../../App";
import Login from "../screens/stack/Authentication/Login";
import SignUp from "../screens/stack/Authentication/SignUp";
import ProfileDetails from "../screens/stack/menu/ProfileDetails";
import OneTimeRegistration from "../screens/stack/OTR/OneTimeRegistration";
import CustomSnackbar from "../components/CustomSnackbar/CustomSnackbar";
import BankDetails from "../screens/stack/menu/BankDetails";
import KYC from "../screens/stack/menu/KYC";
import DraggableCall from "../components/draggableButtons/DraggableCall";
import EconomicCalendar from "../screens/stack/menu/EconomicCalendar";
import { useNotificationService } from "../notification/useNotificationService";
import * as SignalR from "@microsoft/signalr";
import StaticBackground from "../components/background/StaticBackground";

const Stack = createNativeStackNavigator();

const NavigationHandler = () => {
  useNotificationService();
  const dispatch = useDispatch();
  const handleSnackbar = OpenSnackbar();
  const { isInternetReachable } = useNetInfo();
  const adminsocket = useContext(SignalRContext);

  const user = useSelector((store) => store.user);
  const otrDisplay = useSelector((store) => store.otr.otrDisplay);
  const alertBox = useSelector((store) => store.alertBox);
  const snackbarContent = useSelector((store) => store.snackbar);
  const splashDisplay = useSelector((store) => store.splash.splashDisplay);

  const [adBannerDisplay, setAdBannerDisplay] = useState(false);
  const [adBannerDisplayDone, setAdBannerDisplayDone] = useState(false);
  const [versionUpdatePopup, setVersionUpdatePopup] = useState(false);
  const [flexToggle, setFlexToggle] = useState(false);

  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const app = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      app.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    setAppState(nextAppState);
  };
  const backAction = async () => {
    try {
      let alertObj = {
        description: `Are you Sure you want to quit the app?`,
        title: "",
        yesText: "YES",
        noText: "NO",
        onYesPress: async () => {
          dispatch(AlertClose());
          BackHandler.exitApp();
        },
        onNoPress: () => {
          dispatch(AlertClose());
        },
      };
      dispatch(AlertOpen(alertObj));
    } catch (error) {
      console.log("backAction error :", error);
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setFlexToggle(false);
    });

    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setFlexToggle(true);
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);
  const {
    clientConnection,
    clientDetails,
    connectionError,
    endUser,
    accountDetails,
    groupDetails,
    orderDetails,
  } = GLOBALS.socketConnection;
  useEffect(() => {
    if (
      appState === "active" &&
      adminsocket &&
      adminsocket?.state === SignalR.HubConnectionState.Connected
    ) {
      refreshSocket();
      adminsocket?.on(clientDetails, handleClientDetails);
      if (user?.isLoggedIn) {
        const { accountId, groupId } = user?.userDetails?.Data;
        adminsocket?.on(accountDetails, handleAccountDetails);
        adminsocket?.on(groupDetails, handleGroupDetails);
        adminsocket?.on(orderDetails, handleOrderDetails);
        adminsocket?.invoke(endUser, accountId.toString(), groupId.toString());
      }
      adminsocket?.invoke(clientConnection, GLOBALS.FirmName);
    }
    return () => {
      if (adminsocket) {
        refreshSocket();
      }
    };
  }, [appState, user?.isLoggedIn, adminsocket]);

  const refreshSocket = () => {
    try {
      adminsocket?.off(clientDetails, handleClientDetails);
      adminsocket?.off(accountDetails, handleAccountDetails);
      adminsocket?.off(groupDetails, handleGroupDetails);
      adminsocket?.off(orderDetails, handleOrderDetails);
    } catch (error) {
      console.log("refreshSocket error :", error);
    }
  };
  const handleClientDetails = (data) => {
    try {
      let inflatedData = inflateData(data);
      if (inflatedData?.length > 0) {
        let clientDetails = inflatedData[0];
        CheckAppVersion(clientDetails[IS_ANDROID ? "av" : "iv"]);
        let mobileNumberList = valuesWithSpecificKeys(clientDetails, "number");
        let addressList = valuesWithSpecificKeys(clientDetails, "address");
        let emailList = valuesWithSpecificKeys(clientDetails, "email");
        let clientRateInfo = {
          isHigh: clientDetails?.isHigh,
          isLow: clientDetails?.isLow,
          isBuy: clientDetails?.isBuy,
          isSell: clientDetails?.isSell,
          isRateDisplay: clientDetails?.isRate,
          isCoinRateDisplay: clientDetails?.isCoin,
          isTradeEnabled: clientDetails?.isTrade,
          silverCoin: {
            display: clientDetails?.isSilverCoinHeader,
            title: clientDetails?.silverCoinHeader,
          },
          goldCoin: {
            display: clientDetails?.isGoldCoinHeader,
            title: clientDetails?.goldCoinHeader,
          },
        };

        let clientDisplayInfo = {
          Marquee: {
            Top: clientDetails?.marqueeTop,
            Bottom: clientDetails?.marqueeBottom,
          },
          AdBanner: clientDetails?.bannerApp?.trim(),
        };

        dispatch(
          ClientDetailsAction({
            Address: addressList,
            BookingNumber: mobileNumberList,
            Email: emailList,
            WhatsAppNumber: clientDetails?.whatsAppNo,
            Name: "",
            Display: clientDisplayInfo,
            RateInfo: clientRateInfo,
          }),
        );
        if (
          clientDetails?.bannerApp?.trim()?.length > 0 &&
          adBannerDisplayDone == false
        ) {
          setAdBannerDisplay(true);
        }
        if (user?.isLoggedIn && clientDetails?.isLogin == false) {
          dispatch(AlertClose());
          setTimeout(() => {
            dispatch(logoutAction());
            handleSnackbar("Login off from admin", false);
            navigate("Login");
          }, 200);
        }
      }
    } catch (error) {
      console.log("handleClientDetails error", error);
    }
  };
  const handleAccountDetails = (isChange, data) => {
    try {
      if (isChange["status"] == false) {
        dispatch(logoutAction());
        setTimeout(() => {
          navigate("Login");
        }, 300);
      }
    } catch (error) {
      console.log("handleAccountDetails error", error);
    }
  };

  const handleGroupDetails = (data) => {
    try {
      let symbolGroup = inflateData(data);
      dispatch(SymbolGroupDataAction(symbolGroup));
    } catch (error) {
      console.log("handleGroupDetails error :", error);
      dispatch(SymbolGroupDataAction([]));
    }
  };

  const handleOrderDetails = (data) => {
    try {
      dispatch(OrderDetailsUpdate(data));
    } catch (error) {
      console.log("handleGroupDetails error :", error);
    }
  };

  const CheckAppVersion = async (latestVersion) => {
    const currentVersion = await DeviceInfo.getVersion();

    try {
      if (!latestVersion) {
        return;
      }
      setVersionUpdatePopup(
        parseFloat(currentVersion) < parseFloat(latestVersion),
      );
    } catch (error) {
      console.log("CheckAppVersion error : ", error);
    }
  };
  return (
    <SafeAreaView style={styles.SafeAreaViewContainer}>
      {/* <StaticBackground isGradient /> */}
      <StatusBar
        backgroundColor={COLORS.headingBackgorund}
        barStyle={"light-content"}
      />
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
        enabled={!flexToggle}
      >
        {isInternetReachable != null && !isInternetReachable ? (
          <NoInternet />
        ) : (
          <>
            <Stack.Navigator
              // initialRouteName={
              //   (splashDisplay && "SplashScreen") ||
              //   (GLOBALS.hasOTR && otrDisplay && "OTR")
              // }
              screenOptions={{
                headerShown: false,
              }}
            >
              {splashDisplay && (
                <Stack.Screen name="SplashScreen" component={Splash} />
              )}
              {GLOBALS.hasOTR && otrDisplay ? (
                <Stack.Screen name="OTR" component={OneTimeRegistration} />
              ) : (
                <>
                  <Stack.Screen name="BottomTabs" component={AnimatedTab} />
                  <Stack.Screen name="News" component={News} />
                  <Stack.Screen
                    name="ProfileDetails"
                    component={ProfileDetails}
                  />
                  <Stack.Screen
                    name="ContactDetails"
                    component={ContactDetails}
                  />
                  <Stack.Screen name="Calculator" component={Calculator} />
                  <Stack.Screen name="BankDetails" component={BankDetails} />
                  <Stack.Screen name="KYC" component={KYC} />
                  <Stack.Screen
                    name="EconomicCalendar"
                    component={EconomicCalendar}
                  />
                </>
              )}
              {!user.isLoggedIn && (
                <>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="SignUp" component={SignUp} />
                </>
              )}
            </Stack.Navigator>
            {snackbarContent?.visible && <CustomSnackbar />}
            {!splashDisplay &&
              (!GLOBALS.hasOTR || (GLOBALS.hasOTR && !otrDisplay)) && (
                <DraggableCall />
              )}

            {!splashDisplay && adBannerDisplay && !adBannerDisplayDone && (
              <View>
                <Adbanner
                  dismiss={() => {
                    setAdBannerDisplay(false), setAdBannerDisplayDone(true);
                  }}
                />
              </View>
            )}

            {alertBox?.visible && (
              <View>
                <AlertBox
                  visible={alertBox?.visible}
                  description={alertBox?.description}
                  title={alertBox?.title}
                  child={alertBox?.child || <></>}
                  yesText={alertBox?.yesText}
                  noText={alertBox?.noText}
                  onYesPress={alertBox?.onYesPress}
                  onNoPress={alertBox?.onNoPress}
                />
              </View>
            )}
            {!splashDisplay && versionUpdatePopup && (
              <View>
                <AlertBox
                  visible={versionUpdatePopup}
                  description={`New version is available, please update now for exploring best features of ${GLOBALS.AppName}`}
                  title={`Update Available`}
                  yesText={`Update Now`}
                  noText={""}
                  onYesPress={() =>
                    Linking.openURL(
                      IS_ANDROID ? GLOBALS.PlayStoreURL : GLOBALS.AppStoreURL,
                    )
                  }
                  onNoPress={() => {}}
                />
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NavigationHandler;

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryColor,
  },
});
