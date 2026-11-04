import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";

const UserBalanceCard = ({ accountDetails }) => {
  const Balance = parseFloat(accountDetails?.margin || 0);
  const UsedMargin = parseFloat(accountDetails?.usedMargin || 0);
  const FreeMargin = parseFloat(Balance) - parseFloat(UsedMargin) || 0;
  // const FreeMargin = parseFloat(accountDetails?.freeMargin || 0);

  return (
    <View style={styles.balanceContainer}>
      <View style={styles.balanceView}>
        <Text style={styles.balanceTypeText}>Balance</Text>
        <Text style={styles.balanceText}>₹{Balance?.toLocaleString()}</Text>
      </View>
      <View style={styles.verticalLineBreaker} />
      <View style={styles.balanceView}>
        <Text style={styles.balanceTypeText}>Used Margin</Text>
        <Text style={styles.balanceText}>₹{UsedMargin?.toLocaleString()}</Text>
      </View>
      <View style={styles.verticalLineBreaker} />
      <View style={styles.balanceView}>
        <Text style={styles.balanceTypeText}>Free Margin</Text>
        <Text style={styles.balanceText}>₹{FreeMargin?.toLocaleString()}</Text>
      </View>
    </View>
  );
};

export default UserBalanceCard;

const styles = StyleSheet.create({
  balanceContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: COLORS.secondaryColor,
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  balanceView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceTypeText: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: COLORS.primaryColor,
    textAlign: "center",
  },
  balanceText: {
    fontSize: 12,
    fontFamily: FONTS.Medium,
    color: COLORS.primaryColor,
    textAlign: "center",
  },
  verticalLineBreaker: {
    width: 2,
    backgroundColor: COLORS.boxBorder,
  },
});
