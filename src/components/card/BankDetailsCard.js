import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import Entypo from "@react-native-vector-icons/entypo";
import { GLOBALS } from "../../../constants/GLOBALS";

const shareBank = false;

const BankDetailsCard = ({ details }) => {
  const [copiedText, setCopiedText] = useState("");
  const {
    bankLogoUrl,
    bankName,
    accountName,
    accountNumber,
    ifscCode,
    branchName,
  } = details;

  const copyToClipboard = (txt, label) => {
    try {
      Clipboard.setString(txt);
      setCopiedText(`${label} copied to clipboard`);
      setTimeout(() => {
        setCopiedText("");
      }, 2000);
    } catch (e) {
      console.log("Clipboard error:", e);
    }
  };

  const renderField = (label, value) => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: COLORS.whiteColor,
        paddingHorizontal: 10,
        // paddingVertical: 4,
        borderRadius: 6,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          flex: 1,
        }}
      >
        <Text style={styles.title}>{label} : </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          flex: 1,
        }}
      >
        <Text
          onPress={() => copyToClipboard(value, label)}
          style={styles.value}
        >
          {value}
        </Text>
      </View>
    </View>
  );
  return (
    <View style={styles.card}>
      <Image style={styles.logo} source={{ uri: bankLogoUrl }} />
      <View style={{ flex: 1, alignItems: "center", marginHorizontal: 10 }}>
        {renderField("Bank Name", bankName)}
        {renderField("A/c Name", accountName)}
        {renderField("A/c No", accountNumber)}
        {renderField("IFSC Code", ifscCode)}
        {renderField("Branch Name", branchName)}
      </View>

      {copiedText?.trim() != "" && (
        <Text style={styles.copytext}>{copiedText}</Text>
      )}
      {shareBank && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            Share.share({
              title: GLOBALS.AppName,
              message: `Bank Name :- *${bankName}*\nA/c Name :- *${accountName}*\nA/c No :- *${accountNumber}*\nIFSC Code :- *${ifscCode}*\nBranch Name :- *${branchName}*`,
            });
          }}
          style={styles.shareIcon}
        >
          <Entypo name={"share"} size={15} color={COLORS.primaryColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const { primaryColor, blackColor, success } = COLORS;
const { Bold, Medium } = FONTS;

const styles = StyleSheet.create({
  card: {
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: COLORS.whiteColor,
    borderRadius: 6,
    borderColor: COLORS.boxBorder,
    borderWidth: 1,
    margin: 10,
    paddingBottom: 10,
  },
  logo: { width: "80%", height: 100, resizeMode: "contain" },
  title: {
    fontSize: 14,
    fontFamily: Medium,
    color: blackColor,
    // backgroundColor: "red",
    textAlign: "left",
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontFamily: Bold,
    color: blackColor,
    // backgroundColor: "green",
    flex: 1,
    margin: 3,
  },
  copytext: {
    fontSize: 12,
    fontFamily: Bold,
    color: success,
    textAlign: "center",
    width: "90%",
  },
  shareIcon: {
    padding: 8,
    backgroundColor: COLORS.primaryColor,
    borderRadius: 30,
    alignSelf: "flex-end",
    marginRight: 20,
  },
});

export default BankDetailsCard;
