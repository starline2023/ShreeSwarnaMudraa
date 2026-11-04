import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { Images } from "../../../constants/Images";
import { COLORS } from "../../../constants/Colors";
import { WIDTH } from "../../../constants/Styles";
import { FONTS } from "../../../constants/Fonts";
import StaticBackground from "../background/StaticBackground";
import StaticImageBackground from "../background/StaticImageBackground";

const { modalBackground } = COLORS;
const { Semi_Bold, Bold } = FONTS;

const AlertBox = ({
  visible,
  yesText,
  noText,
  child = <></>,
  onYesPress,
  onNoPress,
  title,
  description,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      onDismiss={() => onNoPress()}
      onRequestClose={() => onNoPress()}
      animationType={"slide"}
    >
      <View style={styles.modalBackground}>
        <View style={styles.alertContainer}>
          <View style={styles.appLogoContainer}>
            <View style={styles.halfCircle} />

            <Image
              style={styles.appLogo}
              resizeMode={"contain"}
              source={Images.alertLogo}
            />
          </View>

          <View style={{ height: 40 }} />

          {title.trim() != "" && (
            <View style={styles.alertTitleContainer}>
              {/* <StaticBackground /> */}
              <Text style={styles.alertTitle}>{title}</Text>
            </View>
          )}
          <View style={{ height: 10 }} />

          {description.trim() != "" && (
            <Text style={styles.alertDescription}>{description}</Text>
          )}
          {child}
          <View
            style={[
              styles.alertButtonsContainer,
              {
                justifyContent:
                  yesText.trim() != "" && noText.trim() != ""
                    ? "space-between"
                    : "center",
              },
            ]}
          >
            {noText.trim() != "" && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.alertButtons}
                onPress={() => {
                  onNoPress();
                }}
              >
                {/* <StaticBackground /> */}
                <Text style={styles.alertButtonsText}>{noText}</Text>
              </TouchableOpacity>
            )}
            {yesText.trim() != "" && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.alertButtons}
                onPress={() => {
                  onYesPress();
                }}
              >
                {/* <StaticBackground /> */}
                <Text style={styles.alertButtonsText}>{yesText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertBox;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: modalBackground,
    zIndex: 10,
  },
  alertContainer: {
    width: WIDTH * 0.85,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.headingBackgorund,
    // paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: COLORS.secondaryColor,
    borderWidth: 3,
  },
  appLogoContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.headingBackgorund,
    overflow: "hidden",
    top: -70,
    borderRadius: 10,
    height: 140,
    width: 140,
    borderRadius: 100,
  },
  halfCircle: {
    width: 140, // Same as height of the full circle
    height: 70, // Half of the width
    backgroundColor: COLORS.transparent, // Your desired color
    borderTopLeftRadius: 70, // Half of the width (or more)
    borderTopRightRadius: 70, // Half of the width (or more)
    // Optional: add a border around the shape itself
    borderWidth: 3,
    borderColor: COLORS.secondaryColor,
    borderBottomWidth: 0, // No border on the flat edge
    position: "absolute",
    top: 0,
  },
  appLogo: {
    height: "50%",
    width: "50%",
    marginTop: -30,
  },
  alertTitleContainer: {
    marginVertical: 2,
    width: "90%",
    borderRadius: 5,
    paddingVertical: 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondaryColor,
  },
  alertTitle: {
    color: COLORS.blackColor,
    fontFamily: Semi_Bold,
    textAlign: "center",
    fontSize: 16,
  },
  alertDescription: {
    color: COLORS.whiteColor,
    fontFamily: Semi_Bold,
    textAlign: "center",
    fontSize: 15,
    marginVertical: 5,
    width: "90%",
  },
  alertButtonsContainer: {
    width: "90%",
    padding: 5,
    marginVertical: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  alertButtons: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: COLORS.secondaryColor,
  },
  alertButtonsText: {
    fontFamily: FONTS.Medium,
    textAlign: "center",
    color: COLORS.blackColor,
    fontSize: 15,
  },
});
