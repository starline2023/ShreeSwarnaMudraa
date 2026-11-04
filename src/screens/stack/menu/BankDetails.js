import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { COLORS } from "../../../../constants/Colors";
import StaticImageBackground from "../../../components/background/StaticImageBackground";
import EmptyListComponent from "../../../components/emptyListComponent/EmptyListComponent";
import BankDetailsCard from "../../../components/card/BankDetailsCard";
import { FlashList } from "@shopify/flash-list";
import { getAPI, postAPI } from "../../../../constants/APIs";
import { GLOBALS } from "../../../../constants/GLOBALS";
import { ActivityIndicator } from "react-native-paper";
import CustomHeader from "../../../components/header/CustomHeader";
import StaticBackground from "../../../components/background/StaticBackground";

const BankDetails = () => {
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [bankList, setBankList] = useState([]);
  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      let response = await getAPI(`bankDetails?user=${GLOBALS.FirmName}`);
      setBankList(response?.code == "200" ? response?.data : []);
      setLoading(false);
    } catch (error) {
      console.log("fetchBankDetails error :", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    isFocused && fetchBankDetails();
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color={COLORS.primaryColor} />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, minHeight: 5 }}>
      <StaticBackground isBGImage />
      <CustomHeader />
      <FlashList
        data={bankList}
        extraData={[1, 2]}
        contentContainerStyle={{ paddingBottom: 30 }}
        estimatedItemSize={150}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <View key={`bank_Number_${index}`}>
              <BankDetailsCard details={item} />
              {/* {index + 1 != bankList.length && (
                <View style={styles.horizontalLineBreaker} />
              )} */}
            </View>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <EmptyListComponent
              displayText={"No Bank Details Available"}
              height={150}
            />
          );
        }}
      />
    </View>
  );
};

export default BankDetails;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.transparent,
  },
  horizontalLineBreaker: {
    height: 1,
    backgroundColor: COLORS.primaryColor,
    width: "90%",
    alignSelf: "center",
    marginVertical: 8,
  },
});
