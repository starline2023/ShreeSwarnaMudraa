import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../constants/Colors";
import { HEIGHT, SHADOW, WIDTH } from "../../../constants/Styles";
import { FONTS } from "../../../constants/Fonts";
import { useSelector } from "react-redux";
import Video from "react-native-video";
import StaticBackground from "../background/StaticBackground";

const { whiteColor, primaryColor, blackColor } = COLORS;
const { Semi_Bold } = FONTS;

const Adbanner = ({ dismiss }) => {
  const AdBanner = useSelector((store) => store.clientInfo?.Display?.AdBanner);

  const [loading, setLoading] = useState(true);

  const closeBanner = () => {
    dismiss();
  };

  useEffect(() => {
    if (!AdBanner?.trim()) {
      dismiss();
    }

    setLoading(true);
  }, [AdBanner]);

  const isVideo = (url = "") => /\.(mp4|mov|m4v|avi|mkv|webm)$/i.test(url);

  const video = isVideo(AdBanner);

  const _onLoadEnd = () => {
    setLoading(false);
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      onDismiss={closeBanner}
      onRequestClose={closeBanner}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        {AdBanner?.trim() &&
          (video ? (
            <View style={styles.videoContainer} pointerEvents="none">
              <Video
                source={{
                  uri: encodeURI(AdBanner),
                }}
                style={[
                  styles.video,
                  {
                    opacity: loading ? 0 : 1,
                  },
                ]}
                resizeMode="contain"
                volume={1.0}
                repeat={true}
                controls={false}
                onLoad={_onLoadEnd}
                onReadyForDisplay={_onLoadEnd}
                onError={(error) => {
                  console.log("Ad Banner Video Error:", error);
                  setLoading(false);
                }}
              />
            </View>
          ) : (
            <Image
              style={styles.displayBanner}
              resizeMode="contain"
              source={{
                uri: AdBanner,
              }}
              onLoadEnd={_onLoadEnd}
              onError={(error) => {
                console.log("Ad Banner Image Error:", error);
                setLoading(false);
              }}
            />
          ))}
        {loading && (
          <View style={styles.loader} pointerEvents="none">
            <ActivityIndicator size="large" color={COLORS.blackColor} />
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={closeBanner}
          style={styles.skipButton}
        >
          {/* <StaticBackground isGradient /> */}
          <Text style={styles.skipButtonText}>SKIP</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default Adbanner;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: whiteColor,
  },
  displayBanner: {
    width: WIDTH,
    height: HEIGHT * 0.8,
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.whiteColor,
  },

  video: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.whiteColor,
  },
  loader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButton: {
    position: "absolute",
    bottom: 0,
    width: WIDTH * 0.8,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 8,
    backgroundColor: COLORS.secondaryColor,
    overflow: "hidden",
    // ...SHADOW,
  },

  skipButtonText: {
    fontFamily: Semi_Bold,
    fontSize: 15,
    color: COLORS.blackColor,
  },
});
