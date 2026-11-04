import { StyleSheet, Platform, Dimensions } from "react-native";

export const WIDTH = Dimensions.get("window").width;
export const HEIGHT = Dimensions.get("window").height;

export const IS_ANDROID = Platform.OS == "android";

export const SHADOW = {
  shadowColor: "#161616",
  shadowOffset: {
    width: 5,
    height: 5,
  },
  shadowOpacity: IS_ANDROID ? 0.25 : 0.15,
  shadowRadius: IS_ANDROID ? 3.5 : 2.5,
  elevation: 8,
};
