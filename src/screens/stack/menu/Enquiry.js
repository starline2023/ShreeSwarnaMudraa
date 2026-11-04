import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  LayoutAnimation,
} from "react-native";
import React, { useState, useRef } from "react";
import { GLOBALS } from "../../../../constants/GLOBALS";
import { COLORS } from "../../../../constants/Colors";
import { FONTS } from "../../../../constants/Fonts";
import { SHADOW, WIDTH } from "../../../../constants/Styles";
import { OpenSnackbar, validEmail } from "../../../../constants/Functions";
import { postAPI } from "../../../../constants/APIs";
import { AntDesign } from "../../../../constants/Icons";
import StaticBackground from "../../../components/background/StaticBackground";

const EnquiryFields = [
  {
    key: "name",
    placeHolder: "Name",
    maxLength: undefined,
    keyBoardType: "default",
    multiline: false,
    validate: (val) => val.trim() != "",
    validationErrorText: "Name Should not be empty",
  },
  {
    key: "email",
    placeHolder: "Email",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "email-address",
    validate: (val) => val.trim() != "" && validEmail(val),
    validationErrorText: "Empty or Invalid Email",
  },
  {
    key: "mobile",
    placeHolder: "Mobile Number",
    maxLength: 10,
    keyBoardType: "numeric",
    multiline: false,
    validate: (val) => val.length == 10 && !isNaN(val),
    validationErrorText: "Mobile Number Should contain 10 Digits only",
  },
  {
    key: "subject",
    placeHolder: "Subject",
    maxLength: undefined,
    multiline: false,
    keyBoardType: "default",
    validate: (val) => val.trim() != "",
    validationErrorText: "Subject Should not be empty",
  },
  {
    key: "message",
    placeHolder: "Enquiry Message",
    maxLength: undefined,
    multiline: true,
    keyBoardType: "default",
    validate: (val) => val.trim() != "",
    validationErrorText: "Enquiry Message Should not be empty",
  },
];

const defaultEnquiryObj = {
  name: "",
  email: "",
  mobile: "",
  subject: "",
  message: "",
};
const Enquiry = () => {
  const handleSnackBar = OpenSnackbar();
  const [enquiryObj, setEnquiryObj] = useState({ ...defaultEnquiryObj });
  const [showEnquiry, setShowEnquiry] = useState(true);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  const toggleEnquiryForm = () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowEnquiry(!showEnquiry);
    } catch (error) {
      console.log("toggleEnquiryForm error:", error);
    }
  };
  const handleErrors = () => {
    try {
      for (let item of EnquiryFields) {
        if (!item.validate(enquiryObj[item.key])) {
          handleSnackBar(item.validationErrorText, false);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.log("handleErrors Enquiry :", error);
    }
  };
  const handleEnquiry = async () => {
    try {
      if (!handleErrors()) {
        return;
      }
      Keyboard.dismiss();
      setLoading(true);
      let feedbackObj = {
        ...enquiryObj,
        user: GLOBALS.FirmName,
      };
      let response = await postAPI("feedbackDetails", feedbackObj);
      if (response?.code == 200) {
        setEnquiryObj({ ...defaultEnquiryObj });
      }
      handleSnackBar(response?.message, response?.code == 200);
    } catch (error) {
      console.log("handleEnquiry error :", error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.enquiryContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleEnquiryForm}
        style={styles.contentHeading}
        disabled={true}
      >
        <Text style={[styles.heading]}>Enquire Now</Text>
        {/* <AntDesign
          name={showEnquiry ? "up" : "down"}
          size={20}
          color={COLORS.primaryColor}
        /> */}
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        {showEnquiry && (
          <>
            {EnquiryFields.map((field, index) => (
              <TextInput
                key={field.key}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                placeholder={field.placeHolder}
                placeholderTextColor={COLORS.lightText}
                style={[
                  styles.formInputFields,
                  field?.key == "message" && {
                    height: 120,
                    textAlignVertical: "top",
                  },
                ]}
                multiline={field?.key == "message"}
                value={enquiryObj[field?.key]}
                cursorColor={COLORS.blackColor}
                onChangeText={(text) =>
                  // setEnquiryFields((prev) => ({ ...prev, [field.value]: text }))
                  setEnquiryObj(
                    (prev) => ({ ...prev, [field.key]: text }),
                    // prev.map((item, i) =>
                    //   i === index ? { ...item, value: text } : item
                    // )
                  )
                }
                returnKeyType={
                  index + 1 == EnquiryFields.length ? "done" : "next"
                }
                keyboardType={field?.key == "mobile" ? "numeric" : "default"}
                maxLength={field?.key == "mobile" ? 10 : undefined}
                selectionColor={COLORS.blackColor}
                onSubmitEditing={() => {
                  if (index < EnquiryFields.length - 1) {
                    inputRefs.current[index + 1]?.focus();
                  } else {
                    inputRefs.current[index]?.blur();
                    handleEnquiry();
                  }
                }}
              />
            ))}
            <TouchableOpacity
              onPress={() => handleEnquiry()}
              disabled={loading}
              style={[styles.submitButton, { opacity: loading ? 0.5 : 1 }]}
            >
              <StaticBackground isGradient />
              {loading ? (
                <ActivityIndicator color={COLORS.whiteColor} size={"large"} />
              ) : (
                <Text style={styles.submitButtonText}>Send</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default Enquiry;

const styles = StyleSheet.create({
  enquiryContainer: {
    backgroundColor: COLORS.whiteColor,
    borderColor: COLORS.boxBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
    width: WIDTH * 0.9,
    alignSelf: "center",
    marginVertical: 10,
    // ...SHADOW,
  },
  heading: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: COLORS.primaryColor,
    alignItems: "center",
    marginLeft: 10,
  },
  contentHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  formInputFields: {
    width: "90%",
    paddingHorizontal: 10,
    height: 50,
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 8,
    margin: 10,
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
    backgroundColor: COLORS.whiteColor,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: COLORS.blackColor,
  },
  submitButton: {
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryColor,
  },
  submitButtonText: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: COLORS.whiteColor,
  },
});
