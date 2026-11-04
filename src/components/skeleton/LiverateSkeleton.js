import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { WIDTH } from "../../../constants/Styles";
import { COLORS } from "../../../constants/Colors";

const LiverateSkeleton = ({ type }) => {
  return (
    <SkeletonPlaceholder
      highlightColor={COLORS.primaryColor}
      borderRadius={4}
      enabled={true}
    >
      {type == 1 ? (
        MainProduct()
      ) : type == 2 ? (
        SpotHorizontalCard()
      ) : type == 3 ? (
        FutureRateCards()
      ) : (
        <></>
      )}
    </SkeletonPlaceholder>
  );
};

const MainProduct = () => {
  let mainRateCard = [1, 2, 3, 4, 5];
  return mainRateCard.map((item) => {
    return (
      <View key={`mainRateSkeleton_${item}`} style={styles.mainRateCards} />
    );
  });
};

const SpotHorizontalCard = () => {
  let spotCards = [1, 2, 3];
  return (
    <View style={styles.spotCardsContainer}>
      {spotCards.map((item) => {
        return (
          <View key={`spotRateSkeleton_${item}`} style={styles.spotRateCards} />
        );
      })}
    </View>
  );
};
const FutureRateCards = () => {
  let futureCards = [1, 2];
  return (
    <View style={styles.futureCardsContainer}>
      {futureCards.map((item) => {
        return (
          <View key={`spotRateSkeleton_${item}`} style={styles.futureCards} />
        );
      })}
    </View>
  );
};

export default LiverateSkeleton;

const styles = StyleSheet.create({
  mainRateCards: {
    width: WIDTH * 0.95,
    height: 40,
    borderRadius: 4,
    marginVertical: 2,
    alignSelf: "center",
  },
  spotCardsContainer: {
    width: WIDTH * 0.95,
    flexDirection: "row",
    alignSelf: "center",
  },
  spotRateCards: {
    flex: 1,
    height: 130,
    borderRadius: 8,
    margin: 2,
  },
  futureCardsContainer: {
    width: WIDTH * 0.95,
    flexDirection: "row",
    alignSelf: "center",
    flexWrap: "wrap",
  },
  futureCards: {
    flex: 1,
    height: 130,
    borderRadius: 8,
    margin: 2,
  },
});
