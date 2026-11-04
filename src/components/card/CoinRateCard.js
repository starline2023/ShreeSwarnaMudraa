import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WIDTH } from "../../../constants/Styles";
import { FONTS } from "../../../constants/Fonts";
import { COLORS } from "../../../constants/Colors";
import StaticBackground from "../background/StaticBackground";

const { whiteColor, blackColor, primaryColor } = COLORS;
const textWidth = `50%`;
const CoinRateCard = ({ item, index, AskColors, onSelectItemPress }) => {
  const productName = item?.name;
  const AskRate = item?.ask;
  return (
    <View key={`Coin_Rate_${index}`} style={[styles.mainCardContainer]}>
      <View style={styles.coinNameContainer}>
        {productName && <Text style={styles.coinName}>{productName}</Text>}
      </View>
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
        {/* <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            onSelectItemPress(item);
          }}
          style={[
            styles.bidAskContainer,
            {
              backgroundColor: COLORS.primaryColor,
              width: "30%",
              borderRadius: 4,
            },
          ]}
        >
          <StaticBackground />
          <Text
            style={[
              styles.bidAsk,
              {
                fontSize: 12,
                color: COLORS.blackColor,
              },
            ]}
          >
            BUY
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default CoinRateCard;

const styles = StyleSheet.create({
  mainCardContainer: {
    width: WIDTH * 0.97,
    padding: 3,
    flexDirection: "row",
    backgroundColor: COLORS.productBG,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
    borderRadius: 4,
    marginVertical: 2,
  },
  coinNameContainer: {
    width: "40%",
    paddingLeft: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  coinName: {
    fontFamily: FONTS.Bold,
    color: blackColor,
    fontSize: 14,
  },
  ratesContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: "20%",
  },
  bidAskContainer: {
    width: textWidth,
    borderRadius: 4,
    paddingVertical: 4,
    marginHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  bidAsk: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    includeFontPadding: false,
    textAlign: "center",
  },
});
