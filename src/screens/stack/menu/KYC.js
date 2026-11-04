import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import Heading from "../../../components/header/Heading";
import CustomHeader from "../../../components/header/CustomHeader";
import { HEIGHT, WIDTH } from "../../../../constants/Styles";
import { GLOBALS } from "../../../../constants/GLOBALS";
import StaticImageBackground from "../../../components/background/StaticImageBackground";
import { COLORS } from "../../../../constants/Colors";

const KYC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.headingBackgorund }}>
      {/* <StaticImageBackground /> */}
      <CustomHeader />
      <Heading text={"KYC"} />
      <WebView
        style={{
          height: HEIGHT * 0.7,
          width: WIDTH,
          backgroundColor: COLORS.headingBackgorund,
        }}
        source={{
          uri: GLOBALS.MobileKYC,
        }}
        mixedContentMode="always"
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
};

export default KYC;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
