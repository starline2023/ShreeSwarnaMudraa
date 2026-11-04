import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import Marquee from "../Marquee/Marquee";
import StaticBackground from "../background/StaticBackground";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <>
      <Marquee position={"Bottom"} />
      <View style={styles.tabBarContainer}>
        {/* <StaticBackground isGradient /> */}
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={`bottom-tab-${index}`}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              {options.tabBarIcon({ focused: isFocused })}
              <Text
                style={
                  isFocused ? styles.tabActiveLabelStyle : styles.tabLabelStyle
                }
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: COLORS.primaryColor,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 1,
  },
  tabLabelStyle: {
    color: COLORS.whiteColor,
    fontFamily: FONTS.Bold,
    fontSize: 10,
    textAlign: "center",
  },
  tabActiveLabelStyle: {
    color: COLORS.secondaryColor,
    fontFamily: FONTS.Bold,
    fontSize: 11,
    textAlign: "center",
  },
});
