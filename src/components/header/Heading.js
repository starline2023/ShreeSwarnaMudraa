import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SHADOW, WIDTH } from "../../../constants/Styles";
import { FONTS } from "../../../constants/Fonts";
import { COLORS } from "../../../constants/Colors";
import StaticBackground from "../background/StaticBackground";
const { primaryColor, whiteColor, blackColor } = COLORS;

const Heading = ({
  text,
  width = WIDTH * 0.9,
  backgroundColor = COLORS.headingBackgorund,
  textColor = whiteColor,
}) => {
  return (
    <View style={[styles.headingContainer, { width, backgroundColor }]}>
      <StaticBackground isGradient />
      <Text style={[styles.heading, { color: textColor }]}>{text}</Text>
    </View>
  );
};

export default Heading;

const styles = StyleSheet.create({
  headingContainer: {
    // width: WIDTH * 0.9,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    overflow: "hidden",
    ...SHADOW,
  },
  heading: {
    textAlign: "center",
    fontFamily: FONTS.Bold,
    fontSize: 15,
  },
});
