import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getAPI } from "../../../constants/APIs";
import { GLOBALS } from "../../../constants/GLOBALS";
import { COLORS } from "../../../constants/Colors";
import EmptyListComponent from "../emptyListComponent/EmptyListComponent";
import BankDetailsCard from "../card/BankDetailsCard";
import { HEIGHT, WIDTH } from "../../../constants/Styles";

const BankInfoModal = ({ visible, onClose }) => {
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
    fetchBankDetails();
  }, []);
  const onCloseRequest = () => {
    onClose();
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onCloseRequest}
      onDismiss={onCloseRequest}
      animationType={"slide"}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onCloseRequest}
        style={styles.modalBackground}
      >
        <ScrollView style={styles.modalContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{ flex: 1 }}
            // style={styles.modalContainer}
          >
            <View style={styles.bankDetailWrapper}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size={"large"}
                    color={COLORS.headingBackgorund}
                  />
                </View>
              ) : bankList?.length > 0 ? (
                <>
                  {bankList.map((item, index) => {
                    return (
                      <View key={`bank_Number_${index}`}>
                        <BankDetailsCard details={item} />
                        {index + 1 != bankList.length && (
                          <View style={styles.horizontalLineBreaker} />
                        )}
                      </View>
                    );
                  })}
                </>
              ) : (
                <EmptyListComponent
                  displayText={"No Bank Details Available"}
                  height={150}
                  width={"100%"}
                />
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

export default BankInfoModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    maxHeight: HEIGHT * 0.75,
    minHeight: HEIGHT * 0.6,
    // alignItems: "center",
    backgroundColor: COLORS.secondaryColor,
    borderWidth: 2,
    borderColor: COLORS.primaryColor,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    zIndex: 4,
  },
  bankDetailWrapper: {
    width: WIDTH * 0.98,
    paddingBottom: 50,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalLineBreaker: {
    height: 1,
    backgroundColor: COLORS.primaryColor,
    width: "90%",
    alignSelf: "center",
    marginVertical: 8,
  },
});
