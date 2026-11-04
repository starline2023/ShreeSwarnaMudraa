import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import Heading from "../../../components/header/Heading";
import CustomHeader from "../../../components/header/CustomHeader";
import { HEIGHT, WIDTH } from "../../../../constants/Styles";
import { COLORS } from "../../../../constants/Colors";
import StaticBackground from "../../../components/background/StaticBackground";

const EconomicCalendar = () => {
  const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width,width=device-width initial-scale=0.9, maximum-scale=0.9, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;
  const HTML = `
<script type="text/javascript" src="https://c.mql5.com/js/widgets/calendar/widget.js?6"></script>
<div id="economicCalendarWidget"></div>
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
<script type="text/javascript">
    new economicCalendar({ width: "100%", height: "100%", mode: 1, lang: "en" });
</script>
`;
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.whiteColor }}>
      <StaticBackground isBGImage />
      <CustomHeader />
      <Heading text={"Economic Calendar"} />
      <WebView
        style={{
          height: HEIGHT * 0.7,
          width: WIDTH,
          marginBottom: -30,
          backgroundColor: COLORS.whiteColor,
        }}
        scrollEnabled={false}
        source={{ html: HTML }}
        javaScriptEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={INJECTEDJAVASCRIPT}
      />
    </View>
  );
};

export default EconomicCalendar;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
