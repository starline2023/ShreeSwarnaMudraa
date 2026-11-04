import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import { SHADOW } from "../../../constants/Styles";
import StaticBackground from "../background/StaticBackground";
const { whiteColor, primaryColor, blackColor } = COLORS;
const SpotHorizontalCard = ({
  item,
  index,
  BidColors,
  AskColors,
  showDiff,
  numOfColumns,
}) => {
  return numOfColumns == 3 ? (
    <RenderThreeItems
      item={item}
      index={index}
      BidColors={BidColors}
      AskColors={AskColors}
      showDiff={showDiff}
    />
  ) : (
    <RenderTwoItems
      item={item}
      index={index}
      BidColors={BidColors}
      AskColors={AskColors}
      showDiff={showDiff}
    />
  );
};

const RenderTwoItems = ({ item, index, BidColors, AskColors, showDiff }) => {
  const productName = item?.Symbol_Name;
  const BidRate = item?.Bid;
  const AskRate = item?.Ask;
  const HighRate = item?.High;
  const LowRate = item?.Low;
  return (
    <View key={`spot_Rate_${index}`} style={styles.spotCardContainer}>
      {productName && (
        <View style={styles.spotSymbolNameContainer}>
          <StaticBackground />
          <Text style={[styles.symbolName]}>{productName}</Text>
        </View>
      )}
      <View style={styles.horizontalRatesContainer}>
        <View style={{ width: "50%" }}>
          <Text style={styles.buysellText}>BUY</Text>
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
          <Text style={[styles.highLow, { color: COLORS.failure }]}>
            L : {LowRate}
          </Text>
        </View>
        <View style={{ width: "50%" }}>
          <Text style={styles.buysellText}>SELL</Text>
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
          <Text style={[styles.highLow, { color: COLORS.success }]}>
            H : {HighRate}
          </Text>
        </View>
      </View>
    </View>
  );
};
const RenderThreeItems = ({ item, index, BidColors, AskColors, showDiff }) => {
  const productName = item?.Symbol_Name;
  const BidRate = item?.Bid;
  const AskRate = item?.Ask;
  const HighRate = item?.High;
  const LowRate = item?.Low;
  return (
    <View key={`spot_Rate_${index}`} style={styles.spotCardContainer}>
      {productName && (
        <View style={styles.spotSymbolNameContainer}>
          <StaticBackground />
          <Text style={[styles.symbolName]}>{productName}</Text>
        </View>
      )}
      <View style={styles.ratesContainer}>
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
        {/* {showDiff && <Text style={styles.highLow}>{item?.Difference}</Text>} */}
      </View>
      <View style={styles.highLowContainer}>
        <Text style={[styles.highLow, { color: COLORS.failure }]}>
          {LowRate}
        </Text>
        <Text style={styles.highLow}>|</Text>
        <Text style={[styles.highLow, { color: COLORS.success }]}>
          {HighRate}
        </Text>
      </View>
    </View>
  );
};
export default SpotHorizontalCard;

const styles = StyleSheet.create({
  spotCardContainer: {
    flex: 1,
    // width: '95%',
    flexDirection: "column",
    // paddingBottom: 5,
    backgroundColor: COLORS.productBG,
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    borderColor: COLORS.boxBorder,
    margin: 4,
    // elevation: 5,
  },
  spotSymbolNameContainer: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
    margin: 3,
    borderRadius: 5,
    overflow: "hidden",
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryColor,
  },
  symbolName: {
    flex: 1,
    fontFamily: FONTS.Bold,
    color: COLORS.whiteColor,
    fontSize: 14,
    includeFontPadding: false,
  },
  ratesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalRatesContainer: {
    flex: 1,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 3,
  },
  bidAskContainer: {
    borderRadius: 4,
    paddingVertical: 4,
    width: "80%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  bidAsk: {
    fontFamily: FONTS.Bold,
    fontSize: 14,
    color: COLORS.blackColor,
    includeFontPadding: false,
    textAlign: "center",
  },
  buysellText: {
    fontFamily: FONTS.Bold,
    fontSize: 14,
    color: COLORS.blackColor + 90,
    includeFontPadding: false,
    textAlign: "center",
  },
  diff: {
    fontFamily: FONTS.Medium,
    fontSize: 10,
    includeFontPadding: false,
    color: blackColor,
  },
  highLowContainer: {
    width: "95%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 2,
    paddingVertical: 2,
    borderRadius: 5,
    overflow: "hidden",
  },
  highLow: {
    fontFamily: FONTS.Bold,
    fontSize: 12,
    includeFontPadding: false,
    color: COLORS.blackColor,
    textAlign: "center",
  },
});
