import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { WIDTH } from "../../../constants/Styles";

const ProductListSkeleton = () => {
  const arr = [1, 2];
  return (
    <SkeletonPlaceholder borderRadius={4} enabled={true}>
      <View style={styles.cardsContainer}>
        {arr.map((_, ind) => {
          return (
            <View key={`cards1_${ind}`} style={{ flex: 1 }}>
              <View style={styles.imageContainer} />
              <View style={styles.textContainer} />
            </View>
          );
        })}
      </View>
      <View style={styles.cardsContainer}>
        {arr.map((_, ind) => {
          return (
            <View key={`cards2_${ind}`} style={{ flex: 1 }}>
              <View style={styles.imageContainer} />
              <View style={styles.textContainer} />
            </View>
          );
        })}
      </View>
    </SkeletonPlaceholder>
  );
};

export default ProductListSkeleton;

const styles = StyleSheet.create({
  cardsContainer: { width: WIDTH - WIDTH * 0.25, flexDirection: "row" },
  imageContainer: {
    height: 150,
    borderRadius: 8,
    margin: 3,
  },
  textContainer: {
    height: 10,
    width: "90%",
    alignSelf: "center",
    borderRadius: 8,
    marginVertical: 5,
  },
});
