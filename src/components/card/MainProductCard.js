import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { WIDTH } from "../../../constants/Styles";
import { FONTS } from "../../../constants/Fonts";
import { COLORS } from "../../../constants/Colors";
import { AntDesign } from "../../../constants/Icons";
import { useSelector } from "react-redux";

const { blackColor } = COLORS;
// const textWidth = "24%";

const MainProductCard = ({
  item,
  index,
  BidColors,
  AskColors,
  onSelectItemPress,
  textWidth,
}) => {
  const ratesInfo = useSelector((store) => store?.clientInfo?.RateInfo);
  const productName = item?.name;
  const Time = item?.time;
  const BidRate = item?.bid;
  const AskRate = item?.ask;
  const HighRate = item?.high;
  const LowRate = item?.low;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        onSelectItemPress(item);
      }}
      key={`Main_Product_Rate_${index}`}
      style={[styles.mainCardContainer]}
    >
      <View style={styles.symbolNameContainer}>
        <View>
          {productName && <Text style={styles.symbolName}>{productName}</Text>}
          {Time && (
            <Text style={styles.symbolTime}>
              <AntDesign
                name="clock-circle"
                size={12}
                color={COLORS.blackColor + 90}
              />{" "}
              : {Time}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.allRatesContainer}>
        {ratesInfo?.isBuy && (
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
        )}

        {ratesInfo?.isSell && (
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
        )}

        {ratesInfo?.isHigh && (
          <View style={[styles.ratesContainer, { width: textWidth }]}>
            {ratesInfo?.isHigh && (
              <View
                style={[
                  styles.bidAskContainer,
                  { backgroundColor: COLORS.success + 20 },
                ]}
              >
                <Text style={[styles.highLow, { color: COLORS.success }]}>
                  {HighRate}
                </Text>
              </View>
            )}
          </View>
        )}

        {ratesInfo?.isLow && (
          <View style={[styles.ratesContainer, { width: textWidth }]}>
            <View
              style={[
                styles.bidAskContainer,
                { backgroundColor: COLORS.failure + 20 },
              ]}
            >
              <Text style={[styles.highLow, { color: COLORS.failure }]}>
                {LowRate}
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MainProductCard;

const styles = StyleSheet.create({
  mainCardContainer: {
    width: WIDTH * 0.97,
    paddingVertical: 3,
    flexDirection: "row",
    backgroundColor: COLORS.productBG,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
    borderRadius: 4,
    marginVertical: 2,
    // elevation: 2,
    // ...SHADOW,
  },
  symbolNameContainer: { width: "24%", paddingLeft: 6 },
  symbolName: {
    fontFamily: FONTS.Bold,
    color: COLORS.blackColor,
    fontSize: 13,
  },
  symbolTime: {
    fontFamily: FONTS.Medium,
    color: COLORS.blackColor + 90,
    fontSize: 9,
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
  },
  bidAskContainer: {
    borderRadius: 4,
    paddingVertical: 4,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bidAsk: {
    fontFamily: FONTS.Semi_Bold,
    fontSize: 13,
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
    fontFamily: FONTS.Bold,
    fontSize: 11,
    includeFontPadding: false,
    color: blackColor,
    textAlign: "center",
    alignSelf: "center",
    marginTop: 4,
  },
});
