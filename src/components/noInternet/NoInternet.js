import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { HEIGHT, WIDTH } from "../../../constants/Styles";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import { LottieAnimations } from "../../../constants/LottieAnimations";
import Lottie from "lottie-react-native";
import { Images } from "../../../constants/Images";
import StaticImageBackground from "../background/StaticImageBackground";

const NoInternet = () => {
  return (
    <View style={styles.container}>
      <Image source={Images.logo} style={styles.applogo} />
      <Text style={styles.texts}>
        It Seems like you are having trouble in connecting Internet, Please try
        Again
      </Text>
    </View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    // backgroundColor: COLORS.primaryColor,
  },
  applogo: {
    height: 100,
    width: 250,
    resizeMode: "contain",
    marginTop: "-20%",
  },
  texts: {
    fontSize: 18,
    fontFamily: FONTS.Bold,
    color: COLORS.secondaryColor,
    marginTop: 5,
    width: "75%",
    textAlign: "center",
  },
});
