import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "../../../constants/Icons";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import { WIDTH } from "../../../constants/Styles";

const { primaryColor, blackColor, whiteColor, greyColor, RateText } = COLORS;
const { Medium, Semi_Bold } = FONTS;
const QuantityDropDown = ({ data, value, setValue, suffix = "" }) => {
  // const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.QuantityText}>Qty (in {suffix}) : </Text>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: COLORS.primaryColor },
        ]}
        autoScroll={false}
        containerStyle={styles.containerStyle}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={data}
        labelField="value"
        valueField="value"
        placeholder={!isFocus ? "Quantity" : "..."}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
        renderItem={(item) => {
          let isSelected = false;
          if (value == item.value) {
            isSelected = true;
          }
          return (
            <View
              style={[
                styles.dropDownItem,
                isSelected && { backgroundColor: COLORS.secondaryColor },
              ]}
            >
              <Text
                style={[
                  styles.dropDownText,
                  isSelected && { color: blackColor },
                ]}
              >
                {item.value}
              </Text>
            </View>
          );
        }}
        // inputSearchStyle={styles.inputSearchStyle}
        // search
      />
    </View>
  );
};

export default QuantityDropDown;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.transparent,
    flexDirection: "row",
    alignItems: "center",
  },
  QuantityText: {
    fontFamily: Semi_Bold,
    fontSize: 15,
    color: COLORS.blackColor,
  },
  dropdown: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    width: 180,
    borderColor: COLORS.blackColor,
  },
  placeholderStyle: {
    fontSize: 12,
    color: COLORS.primaryColor,
    fontFamily: Medium,
  },
  containerStyle: {
    borderRadius: 8,
    overflow: "hidden",
    maxHeight: 200,
  },
  selectedTextStyle: {
    fontSize: 15,
    color: COLORS.blackColor,
    fontFamily: Semi_Bold,
    marginLeft: 10,
    textAlign: "center",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropDownItem: {
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    backgroundColor: whiteColor,
    borderWidth: 0.5,
    borderColor: greyColor,
  },
  dropDownText: {
    fontSize: 16,
    color: blackColor,
    fontFamily: Semi_Bold,
  },
});
