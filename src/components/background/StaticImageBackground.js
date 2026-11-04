import { StyleSheet, ImageBackground, View } from "react-native";
import React from "react";
import { Images } from "../../../constants/Images";
import { COLORS } from "../../../constants/Colors";

const StaticImageBackground = ({ extraStyle }) => {
  return (
    // <ImageBackground
    //   style={[styles.staticBackground, extraStyle && { ...extraStyle }]}
    //   source={Images.staticBG}
    //   resizeMode={"cover"}
    // />
    <View style={styles.staticBackground} />
  );
};

export default StaticImageBackground;

const styles = StyleSheet.create({
  staticBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.headingBackgorund,
  },
});
