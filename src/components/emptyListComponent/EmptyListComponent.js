import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import { HEIGHT, WIDTH } from "../../../constants/Styles";

const { primaryColor, whiteColor } = COLORS;
const EmptyListComponent = ({
  displayText,
  height = HEIGHT * 0.5,
  width = WIDTH,
  onPress = null,
}) => {
  return (
    <View style={[styles.emptyListContainer, { height: height, width: width }]}>
      <Text
        // onPress={() => {
        //   if (onPress != null) {
        //     onPress();
        //   }
        // }}
        style={styles.emptyListText}
      >
        {displayText}
      </Text>
    </View>
  );
};

export default EmptyListComponent;

const styles = StyleSheet.create({
  emptyListContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
  },
  emptyListText: {
    fontFamily: FONTS.Bold_Italic,
    fontSize: 15,
    color: COLORS.blackColor,
    width: "85%",
    textAlign: "center",
  },
});
