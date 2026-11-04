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
} from "react-native";
import React, { useRef, useState } from "react";
import { COLORS } from "../../../../constants/Colors";
import { WIDTH } from "../../../../constants/Styles";
import { FONTS } from "../../../../constants/Fonts";
import { OpenSnackbar } from "../../../../constants/Functions";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, Ionicons } from "../../../../constants/Icons";
import { postAPI_Terminal } from "../../../../constants/APIs";

import { loginAction, RememberMeAction } from "../../../redux/action";

import { Images } from "../../../../constants/Images";
import { navigate } from "../../../navigations/RootNavigation";
import { GLOBALS } from "../../../../constants/GLOBALS";
import Heading from "../../../components/header/Heading";
import StaticImageBackground from "../../../components/background/StaticImageBackground";
import StaticBackground from "../../../components/background/StaticBackground";

const { primaryColor, whiteColor } = COLORS;
const { Medium } = FONTS;

const Login = () => {
  const handleSnackBar = OpenSnackbar();
  const dispatch = useDispatch();
  const postTerminalApiResponse = postAPI_Terminal();

  const RememberMe = useSelector((store) => store.user.remember);
  const clientDetails = useSelector((store) => store.clientInfo);
  const user = useSelector((store) => store.user.userDetails);

  const [mobileNumber, setMobileNumber] = useState(
    RememberMe.mobileNumber != null ? RememberMe.mobileNumber : "",
  );
  const [password, setPassword] = useState(
    RememberMe.password != null ? RememberMe.password : "",
  );
  const [rememberMe, setRememberMe] = useState(
    RememberMe.mobileNumber != null ? true : false,
  );

  const [showPassword, setShowPassword] = useState(false);

  const mobileNumberRef = useRef();
  const passwordRef = useRef();

  const [loading, setLoading] = useState(false);

  const backAction = async () => {
    // navigationRef.goBack();
    navigate("BottomTabs", { screen: "Liverate" });
  };

  const handleErrors = () => {
    if (mobileNumber?.trim() == "") {
      handleSnackBar(`Login ID is required`, false);
      return false;
    } else if (password?.trim() == "") {
      handleSnackBar(`Password is Required`, false);
      return false;
    } else {
      return true;
    }
  };
  const handleLogin = async () => {
    try {
      if (!handleErrors()) {
        return;
      }
      setLoading(true);
      // const uniqId = await getUniqueId();
      let loginObj = {
        user: GLOBALS.FirmName,
        loginId: parseInt(mobileNumber),
        password: password,
      };
      let response = await postTerminalApiResponse("login", loginObj);

      if (response?.code == 200) {
        let accountData = response?.data;
        dispatch(
          loginAction({
            ...user,
            Data: { ...accountData, loginId: parseInt(mobileNumber) },
          }),
        );
        dispatch(
          RememberMeAction({
            mobileNumber: rememberMe ? mobileNumber : null,
            password: rememberMe ? password : null,
          }),
        );
        setTimeout(() => {
          // navigationRef.goBack();
          navigate("BottomTabs", { screen: "Liverate" });
          handleEmptyFields();
          handleSnackBar("Logged in Succesfully !!", true);
        }, 200);
      } else {
        handleSnackBar(response?.message || "Something Went Wrong", false);
      }
    } catch (error) {
      console.log("handleLogin error : ", error);
    }
    setLoading(false);
  };

  const handleEmptyFields = () => {
    setMobileNumber("");
    setPassword("");
  };

  return (
    <View style={{ flex: 1 }}>
      <StaticBackground isBGImage />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
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

        <View
          style={{
            borderWidth: 1,
            borderColor: COLORS.boxBorder,
            padding: 10,
            borderRadius: 7,
            backgroundColor: COLORS.whiteColor,
            marginTop: 10,
          }}
        >
          <Heading text={"Login"} />

          <View style={styles.spaceView}>
            <TextInput
              ref={mobileNumberRef}
              value={mobileNumber}
              onChangeText={(text) => {
                setMobileNumber(text);
              }}
              // maxLength={10}
              selectionColor={COLORS.blackColor}
              keyboardType={"numeric"}
              onSubmitEditing={() => passwordRef.current.focus()}
              style={[styles.formInputFields]}
              placeholder={"Login ID"}
              placeholderTextColor={COLORS.lightText}
              returnKeyType="next"
            />
          </View>
          <View style={styles.spaceView}>
            <TextInput
              ref={passwordRef}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!showPassword}
              onSubmitEditing={() => {
                Keyboard.dismiss(), handleLogin();
              }}
              style={[styles.formInputFields, { paddingRight: 40 }]}
              placeholder="Password"
              placeholderTextColor={COLORS.lightText}
              returnKeyType="done"
              activeOutlineColor={primaryColor}
              selectionColor={COLORS.blackColor}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setShowPassword(!showPassword)}
              style={styles.vector}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color={primaryColor}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.9}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 5,
              marginLeft: 20,
              alignSelf: "flex-start",
            }}
          >
            <View
              style={[
                styles.rememberMeBox,
                {
                  backgroundColor: rememberMe
                    ? COLORS.transparent
                    : COLORS.whiteColor,
                },
              ]}
            >
              {rememberMe && (
                <AntDesign name={"check"} size={13} color={COLORS.blackColor} />
              )}
            </View>
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={loading}
          onPress={() => {
            handleLogin();
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
        {clientDetails?.BookingNumber?.length > 0 && (
          <Text style={[styles.heading, { marginTop: 10, fontFamily: Medium }]}>
            Having Problem? Call Us - {clientDetails?.BookingNumber[0]}
          </Text>
        )}

        <Text
          onPress={() => {
            navigate("SignUp"), handleEmptyFields();
          }}
          style={[styles.heading, { marginTop: 10 }]}
        >
          Or Register New Account
        </Text>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.primaryColor,
    // justifyContent: "center",
    // alignItems: "center",
  },
  logoContainer: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: COLORS.boxBorder,
    width: "75%",
    backgroundColor: COLORS.headingBackgorund,
    paddingHorizontal: 10,
    // marginTop: 60,
  },
  headerLogo: {
    height: 100,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center",
    marginVertical: 10,
  },
  headingContainer: {
    width: WIDTH * 0.8,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  heading: {
    textAlign: "center",
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: COLORS.blackColor,
  },
  spaceView: { marginTop: 5 },
  formInputFields: {
    width: WIDTH * 0.8,
    height: 50,
    alignSelf: "center",
    justifyContent: "center",
    padding: 10,
    borderColor: COLORS.boxBorder,
    margin: 5,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: Medium,
    color: COLORS.blackColor,
  },
  vector: {
    height: 25,
    width: 25,
    position: "absolute",
    top: 20,
    right: "7%",
    height: 22,
    width: 22,

    alignSelf: "center",
  },
  rememberMeBox: {
    borderRadius: 4,
    height: 18,
    width: 18,
    borderWidth: 0.8,
    borderColor: COLORS.blackColor,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberMeText: {
    color: COLORS.blackColor,
    fontFamily: FONTS.Medium,
    fontSize: 13,
    marginHorizontal: 5,
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
    // elevation: 10,
  },
});
