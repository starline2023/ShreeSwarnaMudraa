import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { HEIGHT, WIDTH } from "../../../constants/Styles";
import { COLORS } from "../../../constants/Colors";

const Loader = ({ height = HEIGHT * 0.5 }) => {
  return (
    <View style={[styles.loaderContainer, { height: height }]}>
      <ActivityIndicator size={"large"} color={COLORS.linearGradient1} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loaderContainer: {
    width: WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
});
