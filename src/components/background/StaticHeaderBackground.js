import { StyleSheet, ImageBackground } from "react-native";
import React from "react";
import { Images } from "../../../constants/Images";

const StaticHeaderBackground = (props) => {
  return (
    <ImageBackground
      style={[props?.style ? props?.style : styles.staticBackground]}
      source={Images.headerBG}
      resizeMode={"cover"}
    />
  );
};

export default StaticHeaderBackground;

const styles = StyleSheet.create({
  staticBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
