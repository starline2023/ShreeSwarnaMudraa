import React, { useEffect } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../../../constants/Colors";
import { Images } from "../../../../constants/Images";
import { WIDTH } from "../../../../constants/Styles";
import StaticImageBackground from "../../../components/background/StaticImageBackground";
import StaticBackground from "../../../components/background/StaticBackground";

const Splash = () => {
  const dispatch = useDispatch();
  // const otrDisplay = useSelector((store) => store.otr.otrDisplay);
  const nextScreen = async () => {
    try {
      setTimeout(() => {
        dispatch({ type: "SPLASH_DISPLAY" });
        // if (GLOBALS.hasOTR && otrDisplay) {
        //   navigate("OTR");
        // } else {
        //   if (GLOBALS.forceLogin) {
        //     navigate("BottomTabs", { screen: "Liverate" });
        //   } else {
        //     navigate("BottomTabs", { screen: "Liverate" });
        //   }
        // }
      }, 1500);
    } catch (e) {
      console.log("ERROR IN SPLASHSCREEN : ", e);
    }
  };
  useEffect(() => {
    nextScreen();
  }, []);
  return (
    <View style={styles.splashBg}>
      {/* <StaticBackground isGradient /> */}
      <StatusBar
        backgroundColor={COLORS.headingBackgorund}
        barStyle={"light-content"}
      />
      <Image
        source={Images.splash}
        style={styles.splashLogo}
        resizeMode="contain"
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  splashBg: {
    flex: 1,
    backgroundColor: COLORS.headingBackgorund,
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: { height: 300, width: WIDTH * 0.65 },
});
