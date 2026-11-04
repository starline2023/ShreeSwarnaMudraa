import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  BackHandler,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { COLORS } from "../../../../constants/Colors";
import { WIDTH } from "../../../../constants/Styles";
import { FONTS } from "../../../../constants/Fonts";
import { OpenSnackbar, validEmail } from "../../../../constants/Functions";
import { AntDesign } from "../../../../constants/Icons";
import { postAPI_Terminal } from "../../../../constants/APIs";

import { Images } from "../../../../constants/Images";
import { navigate } from "../../../navigations/RootNavigation";
import { GLOBALS } from "../../../../constants/GLOBALS";
import { useIsFocused } from "@react-navigation/native";
import Heading from "../../../components/header/Heading";
import StaticImageBackground from "../../../components/background/StaticImageBackground";
import StaticBackground from "../../../components/background/StaticBackground";

const { primaryColor, whiteColor } = COLORS;
const { Bold } = FONTS;

const SignUpFields = [
  {
    key: "name",
    placeHolder: "Name",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "default",
    validate: (val) => val.trim() != "",
    validationErrorText: "Name Should not be empty",
  },
  {
    key: "mobile",
    placeHolder: "Contact Number",
    maxLength: 10,
    multiline: false,
    keyBoardType: "numeric",
    validate: (val) => val.length == 10 && !isNaN(val),
    // validate: (val) => true,
    validationErrorText: "Contact Number Should contain 10 Digits only",
  },
  {
    key: "firmName",
    placeHolder: "Firm Name",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "default",
    validate: (val) => val.trim() != "",
    validationErrorText: "Firm Name Should not be empty",
  },
  {
    key: "email",
    placeHolder: "Email",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "email-address",
    validate: (val) => val.trim() != "" && validEmail(val),
    // validate: (val) => true,
    validationErrorText: "Empty or Invalid Email",
  },
  {
    key: "city",
    placeHolder: "Enter City",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "default",
    validate: (val) => val.trim() != "",
    // validate: (val) => true,
    validationErrorText: "City Should not be Empty",
  },
  {
    key: "gst",
    placeHolder: "GST Number (optional)",
    maxLength: 15,
    multiline: false,
    keyBoardType: "default",
    validate: () => true,
    validationErrorText: "Empty or Invalid GST Number",
  },
];
const defaultSignup = {
  name: "",
  mobile: "",
  firmName: "",
  email: "",
  city: "",
  gst: "",
};

const SignUp = () => {
  const isFocused = useIsFocused();
  const handleSnackBar = OpenSnackbar();
  const postTerminalApiResponse = postAPI_Terminal();

  const [signupObj, setSignupObj] = useState({ ...defaultSignup });

  const inputRefs = useRef([]);

  const [loading, setLoading] = useState(false);

  const backAction = async () => {
    navigate("Login");
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [isFocused]);

  const handleErrors = () => {
    try {
      for (let item of SignUpFields) {
        if (!item.validate(signupObj[item.key])) {
          handleSnackBar(item.validationErrorText, false);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.log("handleErrors SignUp :", error);
    }
  };
  const handleSignup = async () => {
    try {
      if (!handleErrors()) {
        return;
      }
      setLoading(true);
      Keyboard.dismiss();

      let signUpObj = {
        ...signupObj,
        gst: signupObj.gst.toUpperCase(),
        user: GLOBALS.FirmName,
      };
      let response = await postTerminalApiResponse("register", signUpObj);
      if (response?.code == 200) {
        handleSnackBar(response?.message, true);
        setSignupObj({ ...defaultSignup });
      } else {
        handleSnackBar(response?.message || "Something Went Wrong !", false);
      }
    } catch (error) {
      console.log("handleSignup error : ", error);
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <StaticBackground isBGImag />
      <ScrollView style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={backAction}
          style={{ position: "absolute", top: 20, left: 20 }}
        >
          <AntDesign name={"left"} size={25} color={COLORS.primaryColor} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={Images.logo} style={styles.headerLogo} />
        </View>
        <Heading text={"Signup"} />
        {SignUpFields.map((item, index) => {
          return (
            <View
              key={`ENQUIRY-TEXT-FIELD-${index}`}
              style={{ marginVertical: 5 }}
            >
              <TextInput
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={signupObj[item.key]}
                onChangeText={(val) =>
                  setSignupObj((prev) => ({ ...prev, [item.key]: val }))
                }
                onSubmitEditing={() => {
                  if (index < SignUpFields.length - 1) {
                    inputRefs.current[index + 1]?.focus();
                  } else {
                    handleSignup();
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
                  index + 1 == SignUpFields.length ? "done" : "next"
                }
                selectionColor={COLORS.blackColor}
              />
            </View>
          );
        })}
        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            handleSignup();
          }}
          activeOpacity={0.9}
          style={[styles.loginButton, loading && { opacity: 0.5 }]}
        >
          <StaticBackground isGradient />
          {loading ? (
            <ActivityIndicator size={"small"} color={COLORS.whiteColor} />
          ) : (
            <AntDesign name={"right"} size={20} color={COLORS.whiteColor} />
          )}
        </TouchableOpacity>
        <Text onPress={() => backAction()} style={styles.footerText}>
          Already Have Account ? Login Here
        </Text>
      </ScrollView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.primaryColor,
    // backgroundColor: whiteColor,
    // justifyContent: "center",
    // alignItems: "center",
  },
  logoContainer: {
    padding: 5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "75%",
    backgroundColor: COLORS.headingBackgorund,
    marginTop: 70,
    // borderWidth: 1,
    // borderColor: COLORS.boxBorder,
  },
  headerLogo: {
    height: 100,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 10,
  },
  spaceView: { marginTop: 5 },
  textFields: {
    height: 50,
    backgroundColor: COLORS.whiteColor,
    width: WIDTH * 0.8,
    alignSelf: "center",
    paddingHorizontal: 8,
    color: COLORS.blackColor,
    fontFamily: FONTS.Medium,
    fontSize: 13,
    borderColor: COLORS.boxBorder,
    borderWidth: 1,
    borderRadius: 8,
  },

  loginButton: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 50,
    padding: 5,
    height: 60,
    width: 60,
    marginTop: 20,
    // backgroundColor: primaryColor,
    overflow: "hidden",
  },
  footerText: {
    textAlign: "center",
    fontSize: 15,
    marginVertical: 20,
    fontFamily: Bold,
    color: COLORS.blackColor,
    width: "80%",
    alignSelf: "center",
  },
});
