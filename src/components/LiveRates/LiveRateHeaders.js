import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import StaticBackground from "../background/StaticBackground";
import { WIDTH } from "../../../constants/Styles";

const { whiteColor, primaryColor, secondaryColor, blackColor } = COLORS;

const LiveRateHeaders = ({
  mainHeaderText,
  subHeader,
  backgroundColor = secondaryColor,
  textColor = secondaryColor,
  mainHeaderWidth = "40%",
}) => {
  const displayedSubHeader = subHeader.filter((item) => item != "");
  const textWidth = `${100 / displayedSubHeader.length - 1.5}%`;
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <StaticBackground isGradient />
      {mainHeaderText != undefined && (
        <Text
          style={[
            styles.mainHeader,
            { color: textColor, width: mainHeaderWidth },
          ]}
        >
          {mainHeaderText}
        </Text>
      )}
      <View style={styles.subHeaderContainer}>
        {displayedSubHeader.map((item, index) => {
          return (
            <Text
              key={`${item}-${index}-${mainHeaderText}`}
              style={[styles.subHeader, { color: textColor, width: textWidth }]}
            >
              {item}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

export default LiveRateHeaders;

const styles = StyleSheet.create({
  header: {
    width: WIDTH * 0.97,
    paddingVertical: 5,
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 4,
    // borderWidth: 1,
    // borderColor: whiteColor,
    marginVertical: 2,
    elevation: 2,
    overflow: "hidden",
  },
  mainHeader: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    paddingLeft: 8,
    width: "40%",
  },
  subHeaderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  subHeader: {
    fontFamily: FONTS.Medium,
    fontSize: 13,
    textAlign: "center",
  },
});
