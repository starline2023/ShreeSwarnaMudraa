import React from "react";
import { StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { WIDTH } from "../../../constants/Styles";

const HomeSkeleton = () => {
  return (
    <SkeletonPlaceholder borderRadius={4} enabled={true}>
      <View style={styles.BannerContainer} />
    </SkeletonPlaceholder>
  );
};

export default HomeSkeleton;

const styles = StyleSheet.create({
  BannerContainer: {
    width: WIDTH * 0.9,
    height: 200,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginVertical: 8,
  },
});
