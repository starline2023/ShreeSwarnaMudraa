import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AutoScroll from "@homielab/react-native-auto-scroll";
import { COLORS } from "../../../constants/Colors";
import { useSelector } from "react-redux";
import { FONTS } from "../../../constants/Fonts";
import StaticBackground from "../background/StaticBackground";

const Marquee = ({ position, marginBottom = 0 }) => {
  const MarqueeText = useSelector(
    (store) => store.clientInfo?.Display?.Marquee,
  );
  return (
    <View style={[styles.marqueeContainer, { marginBottom }]}>
      {/* <StaticBackground /> */}
      <AutoScroll style={{ flexDirection: "row" }} endPadding={50}>
        {MarqueeText[position]?.trim() ? (
          <Text numberOfLines={1} style={styles.marqueeText}>
            {MarqueeText[position]}
          </Text>
        ) : (
          <Text style={styles.marqueeText}> </Text>
        )}
      </AutoScroll>
    </View>
  );
};

export default Marquee;

const styles = StyleSheet.create({
  marqueeContainer: {
    backgroundColor: COLORS.secondaryColor,
    height: 30,
    justifyContent: "center",
    overflow: "hidden",
  },

  marqueeText: {
    color: COLORS.blackColor,
    textAlign: "center",
    fontSize: 14,
    fontFamily: FONTS.Semi_Bold,
    paddingVertical: 3,
  },
});
