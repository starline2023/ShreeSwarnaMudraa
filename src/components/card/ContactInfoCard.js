import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import { WIDTH } from "../../../constants/Styles";
import StaticBackground from "../background/StaticBackground";
const { whiteColor } = COLORS;
const { Bold, Bold_Italic } = FONTS;

const ContactInfoCard = ({ item }) => {
  return (
    <View style={styles.contactCard}>
      <View style={styles.contactCardImageContainer}>
        {/* <StaticBackground /> */}
        <Image style={styles.contactImage} source={item.imageSRC} />
      </View>
      <Text style={styles.contactTextTitle}>{item?.title}</Text>
      {item.info.map((infoItem, infoIndex) => {
        return (
          <Text
            key={`${infoItem}_${infoIndex}`}
            style={styles.contactText}
            onPress={() => item.onPress(infoItem)}
          >
            {infoItem}
          </Text>
        );
      })}
    </View>
  );
};

export default ContactInfoCard;

const styles = StyleSheet.create({
  contactCard: {
    minHeight: 100,
    width: WIDTH * 0.85,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 10,
    padding: 10,
    alignSelf: "center",
    paddingLeft: 70,
    borderWidth: 1,
    borderColor: COLORS.secondaryColor,
    marginVertical: 5,
    // elevation: 5,
  },
  contactCardImageContainer: {
    minHeight: 80,
    minWidth: 80,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondaryColor,
    position: "absolute",
    left: -20,
    top: 10,
    // elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.secondaryColor,
    overflow: "hidden",
  },
  contactImage: {
    width: 45,
    height: 45,
    resizeMode: "contain",
    tintColor: COLORS.primaryColor,
    alignSelf: "center",
  },
  contactTextTitle: {
    fontSize: 18,
    fontFamily: Bold_Italic,
    color: COLORS.blackColor,
    textAlign: "center",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 12,
    fontFamily: Bold,
    color: COLORS.blackColor,
    textAlign: "center",
    marginTop: 8,
  },
});
