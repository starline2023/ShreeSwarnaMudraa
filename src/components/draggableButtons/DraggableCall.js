import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import React from "react";
import Draggable from "react-native-draggable";
import { COLORS } from "../../../constants/Colors";
import { Images } from "../../../constants/Images";
import { HEIGHT, SHADOW, WIDTH } from "../../../constants/Styles";
import { useDispatch, useSelector } from "react-redux";
import { AlertClose, AlertOpen } from "../../redux/action";
import { FONTS } from "../../../constants/Fonts";
import { convertToValidPhoneNumber } from "../../../constants/Functions";

const size = 50;

const DraggableCall = () => {
  const dispatch = useDispatch();
  const clientDetails = useSelector((store) => store.clientInfo);

  const onContactPress = (num) => {
    dispatch(AlertClose());
    Linking.openURL("tel:" + convertToValidPhoneNumber(num).match(/\d+/));
  };
  const openModal = () => {
    const numberList = clientDetails.BookingNumber.map(
      (infoItem, infoIndex) => {
        return (
          <Text
            key={`${infoItem}_${infoIndex}`}
            style={styles.contactText}
            onPress={() => onContactPress(infoItem)}
          >
            {infoItem}
          </Text>
        );
      },
    );

    let alertObj = {
      visible: true,
      description: "",
      title: "Contact Number",
      child: numberList,
      yesText: "OK",
      noText: "",
      onYesPress: () => {
        dispatch(AlertClose());
      },
      onNoPress: () => {},
    };
    dispatch(AlertOpen(alertObj));
  };
  if (!clientDetails.BookingNumber.length) return;
  return (
    <Draggable z={10} x={WIDTH * 0.8} y={HEIGHT * 0.75} onDrag={() => {}}>
      <TouchableOpacity
        onPress={openModal}
        activeOpacity={0.9}
        style={styles.button}
      >
        <Image source={Images.callIcon} style={styles.buttonIcons} />
      </TouchableOpacity>
    </Draggable>
  );
};

export default DraggableCall;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.secondaryColor,
    opacity: 0.9,
    height: size,
    width: size,
    borderRadius: 100,
    // borderWidth: 1,
    // borderColor: COLORS.transparent,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
  },
  buttonIcons: {
    resizeMode: "contain",
    tintColor: COLORS.blackColor,
    height: size - 22,
    width: size - 22,
  },
  contactText: {
    fontSize: 12,
    fontFamily: FONTS.Bold,
    color: COLORS.whiteColor,
    textAlign: "center",
    marginTop: 8,
  },
});
