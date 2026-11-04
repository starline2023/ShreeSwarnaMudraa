import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../../constants/Colors";
import { Images } from "../../../constants/Images";

const StaticBackground = ({
  isGradient = false,
  style,
  colors = [
    COLORS.linearGradient1,
    COLORS.linearGradient2,
    COLORS.linearGradient3,
  ],
  extraStyle,
  isBGImage,
}) => {
  if (isGradient) {
    return (
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 0.9, y: 0 }}
        locations={[0, 0.5, 1]}
        colors={colors}
        style={[styles.staticBackground, style]}
      />
    );
  }
  if (isBGImage) {
    return (
      <ImageBackground
        style={[styles.staticBackground, extraStyle && { ...extraStyle }]}
        source={Images.staticBG}
        resizeMode={"cover"}
      />
    );
  }

  return (
    <View
      style={[
        styles.staticBackground,
        { backgroundColor: COLORS.whiteColor },
        style,
      ]}
    />
  );
};

export default StaticBackground;

const styles = StyleSheet.create({
  staticBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
});
