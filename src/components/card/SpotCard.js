import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import { SHADOW, WIDTH } from "../../../constants/Styles";

const { whiteColor, blackColor, secondaryColor } = COLORS;
const textWidth = "24%";
const SpotCard = ({ item, index, BidColors, AskColors, showDiff }) => {
  const productName = item?.Symbol_Name;
  const BidRate = item?.Bid;
  const AskRate = item?.Ask;
  const HighRate = item?.High;
  const LowRate = item?.Low;
  return (
    <View key={`Spot_Product_Rate_${index}`} style={[styles.mainCardContainer]}>
      <View style={styles.symbolNameContainer}>
        {productName && <Text style={styles.symbolName}>{productName}</Text>}
      </View>
      <View style={styles.allRatesContainer}>
        <View style={[styles.ratesContainer, { width: textWidth }]}>
          <View
            style={[
              styles.bidAskContainer,
              { backgroundColor: BidColors.BGColor },
            ]}
          >
            <Text
              style={[
                styles.bidAsk,
                {
                  color: BidColors.textColor,
                },
              ]}
            >
              {BidRate}
            </Text>
          </View>
        </View>
        <View style={[styles.ratesContainer, { width: textWidth }]}>
          <View
            style={[
              styles.bidAskContainer,
              { backgroundColor: AskColors.BGColor },
            ]}
          >
            <Text
              style={[
                styles.bidAsk,
                {
                  color: AskColors.textColor,
                },
              ]}
            >
              {AskRate}
            </Text>
          </View>
        </View>

        <View style={[styles.ratesContainer, { width: textWidth }]}>
          <View
            style={[
              styles.bidAskContainer,
              // { backgroundColor: AskColors.BGColor },
            ]}
          >
            <Text
              style={[
                styles.bidAsk,
                {
                  color: COLORS.blackColor,
                },
              ]}
            >
              {HighRate}
            </Text>
          </View>
        </View>
        <View style={[styles.ratesContainer, { width: textWidth }]}>
          <View
            style={[
              styles.bidAskContainer,
              // { backgroundColor: AskColors.BGColor },
            ]}
          >
            <Text
              style={[
                styles.bidAsk,
                {
                  color: COLORS.blackColor,
                },
              ]}
            >
              {LowRate}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SpotCard;
const styles = StyleSheet.create({
  mainCardContainer: {
    width: WIDTH * 0.97,
    paddingVertical: 3,
    flexDirection: "row",
    backgroundColor: COLORS.whiteColor,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
    borderRadius: 4,
    marginVertical: 2,
    // elevation: 2,
    // ...SHADOW,
  },
  symbolNameContainer: { width: "26%", paddingLeft: 6 },
  symbolName: {
    fontFamily: FONTS.Bold,
    color: COLORS.blackColor,
    fontSize: 12,
  },
  symbolTime: {
    fontFamily: FONTS.Medium,
    color: COLORS.primaryColor,
    fontSize: 10,
  },
  allRatesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  ratesContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: textWidth,
  },
  bidAskContainer: {
    borderRadius: 4,
    paddingVertical: 3,
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bidAsk: {
    fontFamily: FONTS.Semi_Bold,
    fontSize: 12,
    includeFontPadding: false,
    textAlign: "center",
  },
  diff: {
    fontFamily: FONTS.Medium,
    fontSize: 10,
    includeFontPadding: false,
    color: blackColor,
    textAlign: "center",
    alignSelf: "center",
  },
  highLow: {
    marginTop: 2,
    fontFamily: FONTS.Medium,
    fontSize: 11,
    width: textWidth,
    includeFontPadding: false,
    color: blackColor,
    textAlign: "center",
    alignSelf: "center",
  },
});
