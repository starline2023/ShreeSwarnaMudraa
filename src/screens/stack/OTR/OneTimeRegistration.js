import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { COLORS } from "../../../../constants/Colors";
import Heading from "../../../components/header/Heading";
import { Images } from "../../../../constants/Images";
import { WIDTH } from "../../../../constants/Styles";
import { FONTS } from "../../../../constants/Fonts";
import { AntDesign } from "../../../../constants/Icons";
import { postAPI } from "../../../../constants/APIs";
import { OpenSnackbar } from "../../../../constants/Functions";
import { GLOBALS } from "../../../../constants/GLOBALS";
import { navigate } from "../../../navigations/RootNavigation";
import StaticImageBackground from "../../../components/background/StaticImageBackground";
import { ActivityIndicator } from "react-native-paper";

const OTRFields = [
  {
    key: "name",
    placeHolder: "Enter Your Name",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "default",
    validate: (val) => val.trim() != "",
    validationErrorText: "Name Should not be empty",
  },
  {
    key: "firmname",
    placeHolder: "Enter Your Firm Name",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "default",
    validate: (val) => val.trim() != "",
    validationErrorText: "Firm name Should not be empty",
  },
  {
    key: "mobile",
    placeHolder: "Enter Your Mobile Number",
    maxLength: 10,
    multiline: false,
    keyBoardType: "numeric",
    validate: (val) => val.length == 10 && !isNaN(val),
    validationErrorText: "Mobile Number Should contain 10 Digits only",
  },
  {
    key: "city",
    placeHolder: "Enter City",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "default",
    validate: (val) => val.trim() != "",
    validationErrorText: "City Should not be Empty",
  },
];
const defaultOTR = {
  name: "",
  firmname: "",
  mobile: "",
  city: "",
};
const OneTimeRegistration = () => {
  const handleSnackBar = OpenSnackbar();
  const dispatch = useDispatch();
  const [otrForm, setOTRform] = useState({
    ...defaultOTR,
  });
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleErrors = () => {
    try {
      for (let item of OTRFields) {
        if (!item.validate(otrForm[item.key])) {
          handleSnackBar(item.validationErrorText, false);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.log("handleErrors OTR :", error);
    }
  };

  const handleOTRSubmit = async () => {
    try {
      Keyboard.dismiss();
      if (!handleErrors()) {
        return;
      }
      setLoading(true);
      const OTRres = await postAPI("otrDetails", {
        ...otrForm,
        user: GLOBALS.FirmName,
      });
      if (OTRres?.code == "200") {
        dispatch({ type: "OTR_DISPLAY" });
        navigate("BottomTabs", { screen: "Liverate" });
      }
      handleSnackBar(OTRres?.message, OTRres?.code == "200");
      setOTRform({ ...defaultOTR });
    } catch (error) {
      console.log("handleOTRSubmit Error :", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {/* <StaticImageBackground /> */}
      <ScrollView style={styles.container}>
        <Image
          source={Images.splash}
          style={styles.logoStyle}
          resizeMode="contain"
        />
        <Heading text={"One Time Registration"} />
        {OTRFields.map((item, index) => {
          return (
            <View key={`OTR-TEXT-FIELD-${index}`} style={{ marginVertical: 5 }}>
              <TextInput
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={otrForm[item.key]}
                onChangeText={(val) =>
                  setOTRform((prev) => ({ ...prev, [item.key]: val }))
                }
                onSubmitEditing={() => {
                  if (index < OTRFields.length - 1) {
                    inputRefs.current[index + 1]?.focus();
                  } else {
                    handleOTRSubmit();
                  }
                }}
                keyboardType={item.keyBoardType}
                maxLength={item.maxLength}
                placeholder={item.placeHolder}
                placeholderTextColor={COLORS.lightText}
                style={styles.textFields}
                multiline={item.multiline}
                returnKeyType={index + 1 == OTRFields.length ? "done" : "next"}
                selectionColor={COLORS.lightText}
              />
            </View>
          );
        })}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOTRSubmit}
          style={[styles.submitButton, loading && { opacity: 0.5 }]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size={"small"} color={COLORS.whiteColor} />
          ) : (
            <AntDesign
              name={"arrowright"}
              size={25}
              color={COLORS.whiteColor}
            />
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default OneTimeRegistration;

const styles = StyleSheet.create({
  container: { flex: 1 },
  logoStyle: { height: 150, width: 150, alignSelf: "center" },

  textFields: {
    width: WIDTH * 0.9,
    alignSelf: "center",
    paddingHorizontal: 8,
    color: COLORS.primaryColor,
    fontFamily: FONTS.Medium,
    fontSize: 13,
    borderBottomColor: COLORS.primaryColor,
    borderBottomWidth: 1,
  },
  submitButton: {
    height: 50,
    width: 50,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 100,
    backgroundColor: COLORS.primaryColor,
  },
});
