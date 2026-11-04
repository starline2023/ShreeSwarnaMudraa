import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/Colors";
import { Images } from "../../../constants/Images";
import { navigate, navigationRef } from "../../navigations/RootNavigation";
import { WIDTH } from "../../../constants/Styles";
import { AntDesign } from "../../../constants/Icons";
import StaticBackground from "../background/StaticBackground";

const CustomHeader = ({ onBackPress }) => {
  const routeName = navigationRef?.getCurrentRoute()?.name;

  const goBackList = [
    // GLOBALS.isTerminal ? "News" : "",
    "KYC",
    // "News",
    "Calculator",
    "ProductList",
    "AboutUs",
    "ContactDetails",
    "ProfileDetails",
    "EconomicCalendar",
    "BankDetails",
  ];
  return (
    <View style={styles.headerContainer}>
      {/* <StaticBackground isGradient /> */}
      {goBackList.includes(routeName) && (
        <TouchableOpacity
          style={styles.leftButton}
          activeOpacity={0.9}
          onPress={() => {
            onBackPress == undefined ? navigationRef.goBack() : onBackPress();
          }}
        >
          <AntDesign name={"left"} color={COLORS.secondaryColor} size={25} />
        </TouchableOpacity>
      )}
      <Image
        style={styles.logo}
        source={Images.headerLogo}
        resizeMode={"contain"}
      />
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 5,
    backgroundColor: COLORS.primaryColor,
  },
  leftButton: {
    marginLeft: 10,
    position: "absolute",
    left: 20,
  },
  rightButton: {
    marginRight: 10,
    position: "absolute",
    right: 20,
  },

  logo: {
    height: 70,
    width: WIDTH * 0.65,
    marginVertical: 3,
  },
});
