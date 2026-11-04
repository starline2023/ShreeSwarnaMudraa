import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import React from "react";
import { WIDTH } from "../../../constants/Styles";
import { FONTS } from "../../../constants/Fonts";
import { COLORS } from "../../../constants/Colors";
import Lottie from "lottie-react-native";
import { LottieAnimations } from "../../../constants/LottieAnimations";
import StaticBackground from "../background/StaticBackground";

const { whiteColor, primaryColor, modalBackground, blackColor } = COLORS;
const { Medium } = FONTS;
const TradeStatus = ({ onOKPress, visible, message, status }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      onDismiss={() => {}}
      onRequestClose={() => {}}
      animationType={"slide"}
    >
      <View style={styles.modalBackground}>
        <View style={styles.orderStatusContainer}>
          {status != null && (
            <Lottie
              style={styles.animation}
              autoPlay
              loop
              source={
                status ? LottieAnimations.success : LottieAnimations.error
              }
            />
          )}

          <Text style={styles.texts}>{message}</Text>
          <TouchableOpacity
            onPress={onOKPress}
            activeOpacity={0.9}
            style={styles.okButton}
          >
            <StaticBackground isGradient />
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TradeStatus;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: modalBackground,
  },
  orderStatusContainer: {
    width: WIDTH * 0.85,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.whiteColor,
    borderWidth: 3,
    borderColor: COLORS.boxBorder,
    padding: 10,
  },
  animation: { height: WIDTH * 0.5, width: WIDTH * 0.5 },
  texts: {
    fontSize: 18,
    fontFamily: Medium,
    color: COLORS.blackColor,
    marginVertical: 15,
    width: "75%",
    textAlign: "center",
  },
  okButton: {
    margin: 10,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 50,
    backgroundColor: primaryColor,
    overflow: "hidden",
  },
  okButtonText: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: COLORS.whiteColor,
  },
});
