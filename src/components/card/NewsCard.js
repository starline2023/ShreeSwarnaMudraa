import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { WIDTH } from "../../../constants/Styles";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import StaticBackground from "../background/StaticBackground";
const NewsCard = ({ item }) => {
  const ModifiedDate = new Date(item?.modifiedDate);
  const newsDate = ModifiedDate.getDate();
  const Year = ModifiedDate.getFullYear();
  const Month = ModifiedDate.toLocaleString("default", { month: "short" });
  const Time = ModifiedDate.toLocaleTimeString();
  return (
    <View style={styles.newsCardContainer}>
      <View style={styles.dateContainer}>
        <StaticBackground isGradient />
        <Text style={styles.dayText}>{newsDate}</Text>
        <Text style={styles.monthYearText}>
          {Month} {Year}
        </Text>
      </View>
      <Text style={styles.titleText}>{item?.title?.trim()}</Text>
      <Text style={styles.timeText}>{Time}</Text>
      <Text style={styles.descText}>{item?.description?.trim()}</Text>
    </View>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  newsCardContainer: {
    minHeight: 100,
    width: WIDTH * 0.85,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    paddingLeft: 80,
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
    marginVertical: 5,
    // elevation: 5,
  },
  dateContainer: {
    minHeight: 80,
    minWidth: 80,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryColor,
    position: "absolute",
    left: -20,
    top: 10,
    padding: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
    overflow: "hidden",
  },
  dayText: {
    fontFamily: FONTS.Bold,
    fontSize: 20,
    color: COLORS.whiteColor,
    textAlign: "center",
  },
  monthYearText: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: COLORS.whiteColor,
    textAlign: "center",
  },
  titleText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: COLORS.blackColor,
  },
  timeText: {
    fontFamily: FONTS.Regular,
    fontSize: 12,
    color: COLORS.blackColor,
  },
  descText: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
    color: COLORS.blackColor,
  },
});
