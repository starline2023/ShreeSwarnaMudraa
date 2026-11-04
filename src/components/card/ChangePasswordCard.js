import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  LayoutAnimation,
} from "react-native";
import React, { useRef, useState } from "react";
import { COLORS } from "../../../constants/Colors";
import { Entypo, Ionicons } from "../../../constants/Icons";
import { OpenSnackbar } from "../../../constants/Functions";
import { postAPI_Terminal } from "../../../constants/APIs";
import { navigate, navigationRef } from "../../navigations/RootNavigation";
import { AlertClose, AlertOpen, logoutAction } from "../../redux/action";
import { FONTS } from "../../../constants/Fonts";
import StaticBackground from "../background/StaticBackground";
import { WIDTH } from "../../../constants/Styles";
import { useDispatch } from "react-redux";

const passwordFileds = [
  {
    key: "oldPassword",
    placeHolder: "Old Password",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "default",
  },
  {
    key: "newPassword",
    placeHolder: "New Password",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "default",
  },
  {
    key: "cfPassword",
    placeHolder: "Confirm Password",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "default",
  },
];

const defaultChangePassObj = {
  oldPassword: "",
  newPassword: "",
  cfPassword: "",
};
const defaultChangePassShowObj = {
  oldPassword: false,
  newPassword: false,
  cfPassword: false,
};

const ChangePasswordCard = () => {
  const handleSnackBar = OpenSnackbar();
  const dispatch = useDispatch();
  const postTerminalApiResponse = postAPI_Terminal();

  const [passwordAccordion, setPasswordAccordion] = useState(false);
  const [changePassObj, setChangePassObj] = useState({
    ...defaultChangePassObj,
  });
  const [showPassObj, setShowPassObj] = useState({
    ...defaultChangePassShowObj,
  });
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  const handleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPasswordAccordion(!passwordAccordion);
  };
  const handleUpdatePassword = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      if (changePassObj.oldPassword.length == 0) {
        handleSnackBar("Old Password Field cannot be Empty", false);
        setLoading(false);
        return;
      } else if (changePassObj.newPassword.length == 0) {
        handleSnackBar("New Password Field cannot be Empty", false);
        setLoading(false);
        return;
      } else if (changePassObj.oldPassword == changePassObj.newPassword) {
        handleSnackBar(
          "Old Password & New Password are same, Please Change it to new",
          false,
        );
        setLoading(false);
        return;
      } else if (changePassObj.newPassword != changePassObj.cfPassword) {
        handleSnackBar("New Password & Confirm Password do not match", false);
        setLoading(false);
        return;
      }
      let updatePasswordObj = {
        oldPassword: changePassObj.oldPassword,
        newPassword: changePassObj.newPassword,
      };

      let response = await postTerminalApiResponse(
        "changePassword",
        updatePasswordObj,
      );
      console.log("response", response);
      if (response?.code == 200) {
        setChangePassObj({ ...defaultChangePassObj });
        let alertObj = {
          visible: true,
          description: response?.message,
          title: "",
          yesText: "OK",
          noText: "",
          onYesPress: () => {
            dispatch(AlertClose());
          },
          onNoPress: () => {},
        };
        navigationRef.goBack();
        dispatch(AlertOpen(alertObj));
        dispatch(logoutAction());
        setTimeout(() => {
          navigate("Login");
        }, 300);
      } else {
        handleSnackBar(
          response?.message || "Something Went Wrong, Please Try Again Later!",
          false,
        );
      }
    } catch (error) {
      console.log("handleUpdatePassword error :", error);
    }
    setLoading(false);
  };
  return (
    <View
      style={[
        styles.changePasswordContainer,
        { borderWidth: passwordAccordion ? 2 : 2 },
      ]}
    >
      <TouchableOpacity
        onPress={handleAccordion}
        activeOpacity={0.9}
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={
            passwordAccordion ? { transform: [{ rotate: "-180deg" }] } : {}
          }
        >
          <Entypo
            name={"chevron-down"}
            size={25}
            color={COLORS.blackColor}
            style={{ includeFontPadding: false }}
          />
        </View>

        <Text style={[styles.title]}>Change Password</Text>
      </TouchableOpacity>
      {passwordAccordion && (
        <View>
          {passwordFileds.map((item, index) => {
            return (
              <View key={`passwordFileds-${index}`}>
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  value={changePassObj[item.key]}
                  onChangeText={(val) =>
                    setChangePassObj((prev) => ({ ...prev, [item.key]: val }))
                  }
                  secureTextEntry={!showPassObj[item.key]}
                  onSubmitEditing={() => {
                    if (index < passwordFileds.length - 1) {
                      inputRefs.current[index + 1]?.focus();
                    } else {
                      handleUpdatePassword();
                    }
                  }}
                  keyboardType={item.keyBoardType}
                  maxLength={item.maxLength}
                  placeholder={item.placeHolder}
                  placeholderTextColor={COLORS.lightText}
                  style={[
                    styles.textFields,
                    item.multiline && {
                      height: 120,
                      textAlignVertical: "top",
                    },
                  ]}
                  multiline={item.multiline}
                  returnKeyType={
                    index + 1 == passwordFileds.length ? "done" : "next"
                  }
                  selectionColor={COLORS.blackColor}
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>
                    setShowPassObj((prev) => ({
                      ...prev,
                      [item.key]: !showPassObj[item.key],
                    }))
                  }
                  style={styles.vector}
                >
                  <Ionicons
                    name={showPassObj[item.key] ? "eye" : "eye-off"}
                    size={20}
                    color={COLORS.primaryColor}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={loading}
            style={[styles.submitButton, loading && { opacity: 0.5 }]}
            onPress={() => handleUpdatePassword()}
          >
            <StaticBackground isGradient />
            {loading ? (
              <ActivityIndicator size={"large"} color={COLORS.whiteColor} />
            ) : (
              <Text style={styles.submitButtonText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ChangePasswordCard;

const styles = StyleSheet.create({
  changePasswordContainer: {
    padding: 5,
    margin: 5,
    marginHorizontal: 10,
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: COLORS.whiteColor,
    borderColor: COLORS.boxBorder,
    width: WIDTH * 0.95,
  },
  title: {
    fontSize: 15,
    color: COLORS.blackColor,
    fontFamily: FONTS.Bold,
    marginHorizontal: 5,
  },
  textFields: {
    width: WIDTH * 0.8,
    height: 45,
    alignSelf: "center",
    justifyContent: "center",
    padding: 10,
    paddingRight: 35,
    borderColor: COLORS.boxBorder,
    borderWidth: 0.8,
    borderRadius: 6,
    backgroundColor: COLORS.whiteColor,
    margin: 5,
    // borderBottomWidth: 1,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: COLORS.blackColor,
  },
  vector: {
    position: "absolute",
    top: 20,
    right: 35,
    height: 25,
    width: 25,
    alignSelf: "center",
  },
  submitButton: {
    padding: 5,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: COLORS.primaryColor,
    borderRadius: 5,
    marginVertical: 10,
  },
  submitButtonText: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: COLORS.whiteColor,
  },
});
