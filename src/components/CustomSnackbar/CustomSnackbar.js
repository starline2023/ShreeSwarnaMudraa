import { Text, View } from "react-native";
import React from "react";
import { Snackbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../../constants/Colors";
import { Entypo } from "../../../constants/Icons";
import { SnackbarClose } from "../../redux/action";
import { WIDTH } from "../../../constants/Styles";
import { FONTS } from "../../../constants/Fonts";

const CustomSnackbar = () => {
  const dispatch = useDispatch();
  const snackBarContent = useSelector((store) => store.snackbar);
  const SnackBarcolorPalette = {
    bgColor: snackBarContent?.status ? COLORS.lightGreen : COLORS.lightRed,
    txtColor: snackBarContent?.status ? COLORS.success : COLORS.failure,
  };
  return (
    <View>
      <Snackbar
        visible={snackBarContent?.visible}
        icon={() => {
          return (
            <Entypo
              name="cross"
              size={15}
              color={SnackBarcolorPalette["txtColor"]}
            />
          );
        }}
        rippleColor={"transparent"}
        onIconPress={() => dispatch(SnackbarClose())}
        onDismiss={() => dispatch(SnackbarClose())}
        duration={2500}
        elevation={3}
        style={{
          zIndex: 10,
          alignSelf: "center",
          width: WIDTH * 0.85,
          backgroundColor: SnackBarcolorPalette["bgColor"],
          bottom: 65,
          borderWidth: 1,
          borderColor: SnackBarcolorPalette["txtColor"],
        }}
      >
        <Text
          style={{
            color: SnackBarcolorPalette["txtColor"],
            fontFamily: FONTS.Bold,
            fontSize: 13,
          }}
        >
          {snackBarContent?.message}
        </Text>
      </Snackbar>
    </View>
  );
};

export default CustomSnackbar;
