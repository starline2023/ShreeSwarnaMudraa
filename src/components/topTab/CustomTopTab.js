import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";

const { Medium } = FONTS;
const CustomTopTab = ({
  tabArray,
  selectedTab,
  onChangeTab,
  keyToAccess,
  suffix = "",
}) => {
  return (
    <View style={styles.tabsContainer}>
      {tabArray.map((tab, index) => {
        let isSelectedTab = false;

        if (keyToAccess) {
          isSelectedTab = tab[keyToAccess] === selectedTab[keyToAccess];
        } else {
          isSelectedTab = tab === selectedTab;
        }
        return (
          <TouchableOpacity
            activeOpacity={0.9}
            key={`tab_type_${index}`}
            onPress={() => {
              onChangeTab(index);
            }}
            style={[
              styles.tabButtons,
              !isSelectedTab && {
                backgroundColor: COLORS.primaryColor + 40,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                isSelectedTab && {
                  fontFamily: FONTS.Bold,
                  color: COLORS.whiteColor,
                },
              ]}
            >
              {keyToAccess ? tab[keyToAccess] : tab}

              {suffix}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTopTab;

const styles = StyleSheet.create({
  tabsContainer: {
    width: "95%",
    alignSelf: "center",
    flexDirection: "row",
    marginVertical: 10,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
  },
  tabButtons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 3,
    backgroundColor: COLORS.primaryColor,
  },
  tabText: {
    fontFamily: Medium,
    fontSize: 12,
    color: COLORS.blackColor,
    padding: 5,
    textAlign: "center",
  },
});
